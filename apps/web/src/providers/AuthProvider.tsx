'use client';

import type { User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  MOCK_AUTH_COOKIE,
  MOCK_PROFILE,
  MOCK_USER,
  isSupabaseConfigured,
  tryCreateClient,
} from '@/lib/supabase/client';

type Profile = {
  display_name: string;
  xp: number;
  level: number;
  streak_days: number;
  obsidian_vault_path?: string | null;
  obsidian_vault_name?: string | null;
  timezone?: string;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readMockAuth(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes(`${MOCK_AUTH_COOKIE}=true`);
}

function clearMockAuth(): void {
  document.cookie = `${MOCK_AUTH_COOKIE}=; path=/; max-age=0`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => tryCreateClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      if (readMockAuth()) setProfile(MOCK_PROFILE);
      return;
    }
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (!u) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select(
        'display_name, xp, level, streak_days, obsidian_vault_path, obsidian_vault_name, timezone'
      )
      .eq('id', u.id)
      .single();
    if (data) setProfile(data as Profile);
  }, [supabase]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      if (readMockAuth()) {
        setUser(MOCK_USER as unknown as User);
        setProfile(MOCK_PROFILE);
      }
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    const init = async () => {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);
      if (u) await refreshProfile();
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await refreshProfile();
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, refreshProfile]);

  const signOut = useCallback(async () => {
    clearMockAuth();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

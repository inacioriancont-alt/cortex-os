export const MOCK_AUTH_COOKIE = 'cortex-mock-auth';

const PLACEHOLDER_URL = 'https://SEU_PROJETO.supabase.co';
const PLACEHOLDER_KEY = 'sua_chave_anon_publica';

/** Formato: https://abcdefghijklmnop.supabase.co (sem barra no fim, sem /auth ou /rest) */
const SUPABASE_URL_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;

export function normalizeSupabaseUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!SUPABASE_URL_RE.test(trimmed)) return null;
  return trimmed;
}

export function isValidSupabaseAnonKey(raw: string | undefined): boolean {
  if (!raw) return false;
  const key = raw.trim();
  if (key === PLACEHOLDER_KEY || key.length < 20) return false;
  return key.startsWith('eyJ');
}

export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !isValidSupabaseAnonKey(anonKey)) return null;
  return { url, anonKey: anonKey! };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

export function hasMockAuthCookie(cookieHeader: string | null | undefined): boolean {
  if (!cookieHeader) return false;
  return cookieHeader.includes(`${MOCK_AUTH_COOKIE}=true`);
}

export const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'demo@cortex.os',
  user_metadata: { display_name: 'Utilizador Demo' },
} as const;

export const MOCK_PROFILE = {
  display_name: 'Utilizador Demo',
  xp: 1250,
  level: 5,
  streak_days: 7,
} as const;

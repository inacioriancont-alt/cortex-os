import { MOCK_AUTH_COOKIE, isSupabaseConfigured } from '@/lib/supabase/config';

export function readMockAuth(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes(`${MOCK_AUTH_COOKIE}=true`);
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured() && readMockAuth();
}

import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseEnv, isSupabaseConfigured } from './config';

export {
  getSupabaseEnv,
  isSupabaseConfigured,
  MOCK_AUTH_COOKIE,
  MOCK_PROFILE,
  MOCK_USER,
} from './config';

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      'Supabase mal configurado. URL deve ser https://SEU_REF.supabase.co e a chave anon (eyJ...). Veja docs/SUPABASE_SETUP.md'
    );
  }
  if (!browserClient) {
    browserClient = createBrowserClient(env.url, env.anonKey);
  }
  return browserClient;
}

export function tryCreateClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}


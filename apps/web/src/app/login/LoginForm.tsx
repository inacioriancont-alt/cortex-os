'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setup = params.get('setup') === '1';
  const authError = params.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setMessage('Configure .env.local com as chaves do Supabase.');
      return;
    }
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <motion.div className="relative flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl font-bold text-indigo-300 ring-1 ring-indigo-400/30">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Entrar no Cortex OS</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sincronização em tempo real entre web e mobile
          </p>
        </div>

        {setup && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="font-semibold">Configuração necessária</p>
            <p className="mt-1 text-amber-200/80">
              Veja <code className="text-xs">docs/SUPABASE_SETUP.md</code> e preencha{' '}
              <code className="text-xs">apps/web/.env.local</code>.
            </p>
          </div>
        )}

        {authError && (
          <p className="mb-4 text-center text-sm text-red-400">
            Falha na autenticação. Tente novamente.
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Palavra-passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          {message && <p className="text-center text-sm text-red-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'A entrar…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Ainda não tem conta?{' '}
          <Link href="/signup" className="text-indigo-300 hover:text-indigo-200">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

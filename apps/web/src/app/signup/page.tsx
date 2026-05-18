'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setMessage('Configure .env.local com as chaves do Supabase.');
      return;
    }
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage('Conta criada! Se o e-mail de confirmação estiver ativo, confirme e entre.');
    setTimeout(() => router.push('/login'), 2500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-50">
          Criar conta
        </h1>
        <p className="mb-8 text-center text-sm text-slate-400">
          Comece o seu segundo cérebro digital
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Nome
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
              placeholder="O seu nome"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>
          <motion.div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Palavra-passe (mín. 6)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
            />
          </motion.div>

          {message && (
            <p className="text-center text-sm text-indigo-300">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'A criar…' : 'Registar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem conta?{' '}
          <Link href="/login" className="text-indigo-300 hover:text-indigo-200">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

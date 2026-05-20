'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { isDemoMode } from '@/lib/demo-mode';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export function SettingsPanel() {
  const { profile, user, refreshProfile } = useAuth();
  const supabase = tryCreateClient();
  const demo = isDemoMode();

  const [displayName, setDisplayName] = useState('');
  const [vaultPath, setVaultPath] = useState('');
  const [vaultName, setVaultName] = useState('');
  const [timezone, setTimezone] = useState('Europe/Lisbon');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
    setVaultPath(profile?.obsidian_vault_path ?? '');
    setVaultName(profile?.obsidian_vault_name ?? '');
    setTimezone(profile?.timezone ?? 'Europe/Lisbon');
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    if (demo || !supabase || !user) {
      setMessage('Modo demo: alterações guardadas apenas na sessão.');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        obsidian_vault_path: vaultPath.trim() || null,
        obsidian_vault_name: vaultName.trim() || null,
        timezone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);
    if (error) setMessage(error.message);
    else {
      setMessage('Configurações guardadas.');
      await refreshProfile();
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Configurações</h1>
        <p className="mt-1 text-sm text-slate-400">Perfil, Obsidian e preferências</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-xl space-y-5 rounded-2xl p-6"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Nome a mostrar
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Caminho do vault Obsidian
          </label>
          <input
            value={vaultPath}
            onChange={(e) => setVaultPath(e.target.value)}
            placeholder="C:\Users\...\Obsidian\Vault"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Nome do vault
          </label>
          <input
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Fuso horário
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-200"
          >
            <option value="Europe/Lisbon">Europe/Lisbon</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/Sao_Paulo">America/Sao_Paulo</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 text-sm text-slate-400">
          <p>
            Supabase:{' '}
            <span className={isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}>
              {isSupabaseConfigured() ? 'configurado' : 'modo demo / não configurado'}
            </span>
          </p>
          {profile && (
            <p className="mt-1">
              XP: {profile.xp} · Streak: {profile.streak_days} dias
            </p>
          )}
        </div>

        {message && (
          <p className="text-center text-sm text-indigo-300">{message}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
      </motion.div>
    </div>
  );
}

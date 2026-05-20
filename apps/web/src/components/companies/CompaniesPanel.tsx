'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useCompanies } from '@/hooks/useCompanies';

export function CompaniesPanel() {
  const { companies, loading, error, createCompany, deleteCompany } = useCompanies();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    const { error: err } = await createCompany({ name, description });
    if (!err) {
      setName('');
      setDescription('');
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Empresas & clientes</h1>
        <p className="mt-1 text-sm text-slate-400">CRM leve · documentos · processos</p>
      </header>

      <div className="glass mb-6 space-y-3 rounded-2xl p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da empresa…"
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-3 font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Adicionar empresa
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
      {loading ? (
        <p className="text-slate-500">A carregar…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {companies.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-3">
                    <Building2 className="h-8 w-8 text-indigo-400" />
                    <div>
                      <p className="font-semibold text-slate-100">{c.name}</p>
                      <p className="text-xs text-slate-500">/{c.slug}</p>
                      {c.description && (
                        <p className="mt-2 text-sm text-slate-400">{c.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCompany(c.id)}
                    className="rounded-lg p-2 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
          {companies.length === 0 && (
            <li className="col-span-2 py-12 text-center text-slate-500">
              Nenhuma empresa registada.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

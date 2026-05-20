'use client';

import { motion } from 'framer-motion';
import { ArrowRight, GitBranch, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useFlows } from '@/hooks/useFlows';

export function FlowsPanel() {
  const { flows, steps, selectedId, setSelectedId, loading, error, createFlow, deleteFlow } =
    useFlows();
  const [name, setName] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    const { error: err } = await createFlow({ name });
    if (!err) setName('');
  };

  const selected = flows.find((f) => f.id === selectedId);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Fluxos de processo</h1>
        <p className="mt-1 text-sm text-slate-400">Etapas visuais · tarefas por fase</p>
      </header>

      <div className="glass mb-6 flex gap-3 rounded-2xl p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Novo fluxo (ex: Onboarding RH)…"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Criar
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          {loading ? (
            <p className="text-slate-500">A carregar…</p>
          ) : (
            flows.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={`glass flex w-full items-center gap-3 rounded-xl p-4 text-left transition ${
                  selectedId === f.id ? 'ring-2 ring-indigo-400/50' : ''
                }`}
              >
                <GitBranch className="h-5 w-5 text-indigo-400" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100">{f.name}</p>
                  {f.description && (
                    <p className="truncate text-xs text-slate-500">{f.description}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlow(f.id);
                  }}
                  className="rounded p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </button>
            ))
          )}
          {!loading && flows.length === 0 && (
            <p className="text-sm text-slate-500">Crie o primeiro fluxo acima.</p>
          )}
        </div>

        <motion.div
          key={selectedId ?? 'empty'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          {selected ? (
            <>
              <h2 className="text-lg font-semibold text-slate-100">{selected.name}</h2>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {steps.map((s, i) => (
                  <span key={s.id} className="flex items-center gap-2">
                    <span
                      className="rounded-lg px-3 py-2 text-sm font-medium"
                      style={{
                        background: `${s.color ?? '#6366f1'}33`,
                        color: s.color ?? '#a5b4fc',
                      }}
                    >
                      {s.label}
                    </span>
                    {i < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-slate-600" />
                    )}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-500">Selecione um fluxo para ver as etapas.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

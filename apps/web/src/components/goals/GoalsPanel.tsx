'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useGoals } from '@/hooks/useGoals';

export function GoalsPanel() {
  const { goals, loading, error, createGoal, incrementGoal, deleteGoal } = useGoals();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('10');

  const handleAdd = async () => {
    if (!title.trim()) return;
    const { error: err } = await createGoal({
      title,
      targetValue: parseInt(target, 10) || 10,
    });
    if (!err) {
      setTitle('');
      setTarget('10');
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Metas</h1>
        <p className="mt-1 text-sm text-slate-400">Objetivos com progresso visual</p>
      </header>

      <div className="glass mb-6 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da meta…"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
        />
        <input
          type="number"
          min={1}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-24 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100"
        />
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
      {loading ? (
        <p className="text-slate-500">A carregar…</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {goals.map((g) => {
              const pct = Math.min(
                100,
                Math.round((g.currentValue / g.targetValue) * 100) || 0
              );
              return (
                <motion.li
                  key={g.id}
                  layout
                  className="glass rounded-2xl p-5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex gap-3">
                      <Target className="h-6 w-6 text-violet-400" />
                      <div>
                        <p className="font-semibold text-slate-100">{g.title}</p>
                        <p className="text-xs text-slate-500">
                          {g.currentValue} / {g.targetValue} {g.unit}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    onClick={() => incrementGoal(g.id)}
                    disabled={g.currentValue >= g.targetValue}
                    className="mt-4 text-sm text-indigo-300 hover:text-indigo-200 disabled:opacity-40"
                  >
                    +1 progresso
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
          {goals.length === 0 && (
            <li className="col-span-2 py-12 text-center text-slate-500">Sem metas definidas.</li>
          )}
        </ul>
      )}
    </div>
  );
}

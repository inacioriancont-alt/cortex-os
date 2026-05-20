'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { useGoals } from '@/hooks/useGoals';
import { useTasksRealtime } from '@/hooks/useTasksRealtime';
import { useAuth } from '@/providers/AuthProvider';
import { progressToNextLevel } from '@cortex/shared';

export function ReportsPanel() {
  const { tasks, stats, loading: tasksLoading } = useTasksRealtime('all');
  const { goals } = useGoals();
  const { profile } = useAuth();

  const report = useMemo(() => {
    const byPriority = { urgent: 0, high: 0, medium: 0, low: 0 };
    const byStatus: Record<string, number> = {};
    let overdue = 0;
    const now = Date.now();

    for (const t of tasks) {
      byPriority[t.priority]++;
      byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
      if (t.dueAt && t.status !== 'done' && new Date(t.dueAt).getTime() < now) {
        overdue++;
      }
    }

    const completionRate =
      stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    const weekBars = [0, 0, 0, 0, 0, 0, 0];
    const doneTasks = tasks.filter((t) => t.status === 'done' && t.completedAt);
    for (const t of doneTasks) {
      const d = new Date(t.completedAt!);
      const diff = Math.floor((now - d.getTime()) / 86400000);
      if (diff >= 0 && diff < 7) weekBars[6 - diff]++;
    }
    const maxBar = Math.max(1, ...weekBars);

    return { byPriority, byStatus, overdue, completionRate, weekBars, maxBar };
  }, [tasks, stats]);

  const xp = progressToNextLevel(profile?.xp ?? 0);

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Relatórios</h1>
        <p className="mt-1 text-sm text-slate-400">Produtividade e conclusão em tempo real</p>
      </header>

      {tasksLoading ? (
        <p className="text-slate-500">A carregar…</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-sm text-slate-400">Taxa de conclusão</p>
            <p className="mt-2 text-4xl font-bold text-indigo-300">
              {report.completionRate}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {stats.done} de {stats.total} tarefas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-sm text-slate-400">Atrasadas</p>
            <p className="mt-2 text-4xl font-bold text-amber-300">{report.overdue}</p>
            <p className="mt-1 text-xs text-slate-500">Com prazo ultrapassado</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <p className="text-sm text-slate-400">XP / Nível</p>
            <p className="mt-2 text-4xl font-bold text-violet-300">
              {profile?.xp ?? 0}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Nível {xp.level} · {xp.current}/{xp.max}
            </p>
          </motion.div>

          <div className="glass rounded-2xl p-6 md:col-span-2">
            <p className="mb-4 text-sm font-medium text-slate-300">
              Conclusões nos últimos 7 dias
            </p>
            <div className="flex h-32 items-end gap-2">
              {report.weekBars.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600/50 to-indigo-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${(h / report.maxBar) * 100}%` }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                  />
                  <span className="text-[10px] text-slate-600">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="mb-3 text-sm font-medium text-slate-300">Por prioridade</p>
            <ul className="space-y-2 text-sm">
              {Object.entries(report.byPriority).map(([k, v]) => (
                <li key={k} className="flex justify-between text-slate-400">
                  <span className="uppercase">{k}</span>
                  <span className="text-slate-200">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 xl:col-span-3">
            <p className="mb-3 text-sm font-medium text-slate-300">Metas ativas</p>
            <div className="flex flex-wrap gap-4">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="rounded-xl bg-black/20 px-4 py-3 ring-1 ring-white/5"
                >
                  <p className="text-sm text-slate-200">{g.title}</p>
                  <p className="text-xs text-indigo-300">
                    {g.currentValue}/{g.targetValue} {g.unit}
                  </p>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-sm text-slate-500">Nenhuma meta — crie em Metas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

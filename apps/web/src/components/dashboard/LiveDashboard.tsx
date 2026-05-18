'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import {
  FlowsWidget,
  ProductivityWidget,
  QuickStats,
} from '@/components/dashboard/widgets';
import { useTasksRealtime } from '@/hooks/useTasksRealtime';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Task } from '@cortex/shared';

function TasksTodayLive({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks.filter((t) => {
    if (t.status === 'done' || t.status === 'cancelled') return false;
    if (!t.dueAt) return true;
    const d = new Date(t.dueAt);
    return d >= today && d < tomorrow;
  });

  const urgent = todayTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  return (
    <GlassCard
      title="Tarefas de hoje"
      subtitle={`${todayTasks.length} ativas · ${urgent.length} prioritárias`}
      action={
        <Link href="/tarefas" className="text-xs text-indigo-300 hover:text-indigo-200">
          Ver todas →
        </Link>
      }
      delay={0.05}
    >
      <ul className="space-y-2">
        {todayTasks.slice(0, 5).map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-xl bg-black/20 px-3 py-2.5 ring-1 ring-white/5"
          >
            <span className="h-4 w-4 rounded border border-indigo-400/40" />
            <span className="flex-1 text-sm text-slate-200">{t.title}</span>
            <span className="text-[10px] uppercase text-slate-500">{t.priority}</span>
          </li>
        ))}
        {todayTasks.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-500">
            Sem tarefas para hoje.{' '}
            <Link href="/tarefas" className="text-indigo-300">
              Criar uma
            </Link>
          </p>
        )}
      </ul>
    </GlassCard>
  );
}

export function LiveDashboard() {
  const { tasks, stats, loading } = useTasksRealtime('all');

  return (
    <div className="p-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-indigo-300/80">Sincronizado em tempo real</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-50">
            O seu dia, organizado
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {loading
              ? 'A carregar…'
              : `${stats.pending} pendentes · ${stats.done} concluídas`}
          </p>
        </div>
        <Link href="/tarefas">
          <motion.span
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
          >
            <Plus className="h-4 w-4" />
            Nova tarefa
          </motion.span>
        </Link>
      </motion.header>

      <QuickStats />

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <TasksTodayLive tasks={tasks} />
        <ProductivityWidget />
        <FlowsWidget />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 xl:col-span-2"
        >
          <h2 className="font-semibold text-emerald-100">Fase 2A ativa</h2>
          <p className="mt-2 text-sm text-slate-300">
            Login Supabase, tarefas com Realtime e XP ao concluir. Abra o mesmo projeto no
            telemóvel (app gestao-tarefas) com as mesmas credenciais para ver as tarefas
            sincronizadas.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

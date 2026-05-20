'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Flame, Zap } from 'lucide-react';
import Link from 'next/link';

import { GlassCard } from '@/components/ui/GlassCard';
import type { Flow, FlowStep, Goal, Task } from '@cortex/shared';

export function ProductivityWidget({
  weekBars,
  doneCount,
}: {
  weekBars: number[];
  doneCount: number;
}) {
  const max = Math.max(1, ...weekBars);
  return (
    <GlassCard title="Produtividade semanal" subtitle={`${doneCount} concluídas (7 dias)`} delay={0.1}>
      <motion.div className="flex h-28 items-end justify-between gap-2">
        {weekBars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600/40 to-indigo-400/80"
            initial={{ height: 0 }}
            animate={{ height: `${(h / max) * 100}%` }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.5 }}
          />
        ))}
      </motion.div>
    </GlassCard>
  );
}

export function FlowsWidget({
  flows,
  steps,
}: {
  flows: Flow[];
  steps: FlowStep[];
}) {
  const flow = flows[0];
  const flowSteps = flow ? steps.filter((s) => s.flowId === flow.id) : [];

  return (
    <GlassCard
      title="Fluxos em andamento"
      subtitle={flows.length ? `${flows.length} fluxo(s)` : 'Nenhum fluxo'}
      delay={0.15}
      action={
        <Link href="/fluxos" className="text-xs text-indigo-300 hover:text-indigo-200">
          Gerir →
        </Link>
      }
    >
      {flowSteps.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {flowSteps.map((s, i) => (
            <span key={s.id} className="flex items-center gap-1">
              <span className="rounded-lg bg-indigo-500/25 px-2 py-1 text-indigo-200">
                {s.label}
              </span>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="h-3 w-3 text-slate-600" />
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          <Link href="/fluxos" className="text-indigo-300">
            Criar um fluxo
          </Link>
        </p>
      )}
    </GlassCard>
  );
}

export function QuickStats({
  pending,
  streak,
  goalsCount,
}: {
  pending: number;
  streak: number;
  goalsCount: number;
}) {
  const stats = [
    { label: 'Pendentes', value: String(pending), icon: Zap, color: 'text-violet-300' },
    { label: 'Streak', value: `${streak} dias`, icon: Flame, color: 'text-amber-300' },
    { label: 'Metas', value: String(goalsCount), icon: Calendar, color: 'text-sky-300' },
  ];
  return (
    <motion.div
      className="grid grid-cols-3 gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {stats.map((s) => (
        <GlassCard key={s.label} className="!p-4">
          <s.icon className={`mb-2 h-4 w-4 ${s.color}`} />
          <p className="text-lg font-semibold text-slate-100">{s.value}</p>
          <p className="text-xs text-slate-500">{s.label}</p>
        </GlassCard>
      ))}
    </motion.div>
  );
}

export function GoalsWidget({ goals }: { goals: Goal[] }) {
  return (
    <GlassCard
      title="Metas"
      subtitle={`${goals.length} ativas`}
      delay={0.12}
      action={
        <Link href="/metas" className="text-xs text-indigo-300 hover:text-indigo-200">
          Ver →
        </Link>
      }
    >
      <ul className="space-y-2">
        {goals.slice(0, 3).map((g) => {
          const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
          return (
            <li key={g.id}>
              <div className="flex justify-between text-xs text-slate-400">
                <span className="truncate text-slate-200">{g.title}</span>
                <span>{pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
        {goals.length === 0 && (
          <p className="text-sm text-slate-500">Defina metas em Metas</p>
        )}
      </ul>
    </GlassCard>
  );
}

export function useWeekCompletionBars(tasks: Task[]): number[] {
  const bars = [0, 0, 0, 0, 0, 0, 0];
  const now = Date.now();
  for (const t of tasks) {
    if (t.status !== 'done' || !t.completedAt) continue;
    const diff = Math.floor((now - new Date(t.completedAt).getTime()) / 86400000);
    if (diff >= 0 && diff < 7) bars[6 - diff]++;
  }
  return bars;
}

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Flame, Zap } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';

const TODAY_TASKS = [
  { title: 'Revisar documentação cliente', priority: 'urgent', time: '09:30' },
  { title: 'Assinatura contrato — Empresa X', priority: 'high', time: '11:00' },
  { title: 'Sync Obsidian vault', priority: 'medium', time: '14:00' },
];

const PRIORITY_STYLE: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-300',
  high: 'bg-amber-500/20 text-amber-300',
  medium: 'bg-indigo-500/20 text-indigo-300',
};

export function TasksTodayWidget() {
  return (
    <GlassCard
      title="Tarefas de hoje"
      subtitle="3 pendentes · 1 urgente"
      delay={0.05}
      action={
        <button className="text-xs text-indigo-300 hover:text-indigo-200">
          Ver todas →
        </button>
      }
    >
      <ul className="space-y-2">
        {TODAY_TASKS.map((t, i) => (
          <motion.li
            key={t.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex items-center gap-3 rounded-xl bg-black/20 px-3 py-2.5 ring-1 ring-white/5"
          >
            <span className="h-4 w-4 rounded border border-indigo-400/40" />
            <motion.span
              className="flex-1 text-sm text-slate-200"
              whileHover={{ x: 2 }}
            >
              {t.title}
            </motion.span>
            <span className="text-xs text-slate-500">{t.time}</span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${PRIORITY_STYLE[t.priority]}`}
            >
              {t.priority}
            </span>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function ProductivityWidget() {
  return (
    <GlassCard title="Produtividade semanal" subtitle="+18% vs semana passada" delay={0.1}>
      <motion.div
        className="flex h-28 items-end justify-between gap-2"
        initial="hidden"
        animate="visible"
      >
        {[40, 65, 55, 80, 72, 90, 68].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600/40 to-indigo-400/80"
            variants={{
              hidden: { height: 0 },
              visible: { height: `${h}%` },
            }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.5 }}
          />
        ))}
      </motion.div>
      <p className="mt-3 text-xs text-slate-400">12 tarefas concluídas · 4h foco</p>
    </GlassCard>
  );
}

export function FlowsWidget() {
  const steps = ['Admissão', 'Documentação', 'Assinatura', 'Cadastro', 'Folha'];
  return (
    <GlassCard title="Fluxos em andamento" subtitle="RH · 2 processos" delay={0.15}>
      <div className="flex flex-wrap items-center gap-1 text-xs">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1">
            <span
              className={`rounded-lg px-2 py-1 ${i < 3 ? 'bg-indigo-500/25 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight className="h-3 w-3 text-slate-600" />
            )}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

export function QuickStats() {
  const stats = [
    { label: 'Foco hoje', value: '2h 15m', icon: Zap, color: 'text-violet-300' },
    { label: 'Streak', value: '5 dias', icon: Flame, color: 'text-amber-300' },
    { label: 'Próximo', value: '11:00', icon: Calendar, color: 'text-sky-300' },
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

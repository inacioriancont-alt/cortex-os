'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

import { GlassCard } from './GlassCard';

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
};

export function PlaceholderPage({ title, description, icon: Icon, phase }: Props) {
  return (
    <div className="p-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
          <Icon className="h-6 w-6 text-indigo-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      </motion.header>
      <GlassCard title={`Em desenvolvimento · ${phase}`}>
        <p className="text-sm text-slate-400">
          Esta área faz parte do roadmap. A estrutura de navegação e o schema de dados
          já estão preparados.
        </p>
      </GlassCard>
    </div>
  );
}

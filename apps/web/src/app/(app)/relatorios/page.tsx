'use client';

import { BarChart3 } from 'lucide-react';

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function RelatoriosPage() {
  return (
    <PlaceholderPage
      title="Relatórios"
      icon={BarChart3}
      phase="Fase 5"
      description="Produtividade, horas de foco, atrasos, evolução mensal e taxa de conclusão por setor."
    />
  );
}

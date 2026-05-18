'use client';

import { GitBranch } from 'lucide-react';

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function FluxosPage() {
  return (
    <PlaceholderPage
      title="Fluxos de processo"
      icon={GitBranch}
      phase="Fase 4"
      description="Fluxogramas visuais interativos: etapas arrastáveis, ligações automáticas e tarefas por etapa."
    />
  );
}

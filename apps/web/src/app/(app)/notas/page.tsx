'use client';

import { FileText } from 'lucide-react';

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function NotasPage() {
  return (
    <PlaceholderPage
      title="Notas & documentação"
      icon={FileText}
      phase="Fase 2"
      description="Markdown nativo, templates, backlinks automáticos e sync bidirecional com o vault Obsidian."
    />
  );
}

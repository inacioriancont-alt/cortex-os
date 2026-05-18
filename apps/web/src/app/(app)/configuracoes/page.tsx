'use client';

import { Settings } from 'lucide-react';

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function ConfiguracoesPage() {
  return (
    <PlaceholderPage
      title="Configurações"
      icon={Settings}
      phase="Fase 1–2"
      description="Vault Obsidian, horário de trabalho, notificações, tema, widgets do dashboard e integrações."
    />
  );
}

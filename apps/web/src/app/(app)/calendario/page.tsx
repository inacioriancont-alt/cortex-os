'use client';

import { Calendar } from 'lucide-react';

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function CalendarioPage() {
  return (
    <PlaceholderPage
      title="Calendário"
      icon={Calendar}
      phase="Fase 3"
      description="Agenda inteligente, drag-and-drop, time blocking, Google Calendar e sincronização com tarefas."
    />
  );
}

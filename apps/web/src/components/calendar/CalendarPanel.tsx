'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useTasksRealtime } from '@/hooks/useTasksRealtime';
import type { Task } from '@cortex/shared';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function tasksOnDay(tasks: Task[], day: Date): Task[] {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return tasks.filter((t) => {
    if (!t.dueAt && !t.startAt) return false;
    const d = new Date(t.dueAt ?? t.startAt!);
    return d >= start && d < end;
  });
}

export function CalendarPanel() {
  const { tasks, loading } = useTasksRealtime('all');
  const [cursor, setCursor] = useState(() => new Date());

  const { year, month, days, monthLabel } = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    return {
      year: y,
      month: m,
      days: cells,
      monthLabel: cursor.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }),
    };
  }, [cursor]);

  const prev = () => setCursor(new Date(year, month - 1, 1));
  const next = () => setCursor(new Date(year, month + 1, 1));

  const upcoming = tasks
    .filter((t) => t.dueAt && t.status !== 'done')
    .sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime())
    .slice(0, 8);

  return (
    <div className="p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Calendário</h1>
          <p className="mt-1 text-sm text-slate-400">Tarefas por data de vencimento</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="rounded-lg bg-slate-800 p-2 text-slate-300">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[160px] text-center font-medium capitalize text-slate-200">
            {monthLabel}
          </span>
          <button onClick={next} className="rounded-lg bg-slate-800 p-2 text-slate-300">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass rounded-2xl p-4 xl:col-span-2">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="min-h-[72px]" />;
              const dayTasks = tasksOnDay(tasks, day);
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <motion.div
                  key={day.toISOString()}
                  className={`min-h-[72px] rounded-lg p-1.5 ${
                    isToday ? 'bg-indigo-500/15 ring-1 ring-indigo-400/40' : 'bg-black/20'
                  }`}
                >
                  <span className="text-xs text-slate-400">{day.getDate()}</span>
                  <ul className="mt-1 space-y-0.5">
                    {dayTasks.slice(0, 2).map((t) => (
                      <li
                        key={t.id}
                        className="truncate rounded bg-indigo-500/30 px-1 text-[10px] text-indigo-100"
                      >
                        {t.title}
                      </li>
                    ))}
                    {dayTasks.length > 2 && (
                      <li className="text-[10px] text-slate-500">+{dayTasks.length - 2}</li>
                    )}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold text-slate-100">Próximos prazos</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">A carregar…</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {upcoming.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg bg-black/20 px-3 py-2 text-sm text-slate-300"
                >
                  <p className="font-medium text-slate-100">{t.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(t.dueAt!).toLocaleDateString('pt-PT')}
                  </p>
                </li>
              ))}
              {upcoming.length === 0 && (
                <p className="text-sm text-slate-500">
                  Sem prazos.{' '}
                  <Link href="/tarefas" className="text-indigo-300">
                    Adicionar data nas tarefas
                  </Link>
                </p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

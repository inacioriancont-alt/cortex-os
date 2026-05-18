'use client';

import type { Priority, Task } from '@cortex/shared';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useTasksRealtime, type TaskFilter } from '@/hooks/useTasksRealtime';

const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const PRIORITY_STYLE: Record<Priority, string> = {
  low: 'bg-emerald-500/20 text-emerald-300',
  medium: 'bg-indigo-500/20 text-indigo-300',
  high: 'bg-amber-500/20 text-amber-300',
  urgent: 'bg-red-500/20 text-red-300',
};

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'done', label: 'Concluídas' },
];

export function TaskBoard() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const { tasks, loading, error, stats, createTask, updateTaskStatus, deleteTask } =
    useTasksRealtime(filter);

  const handleAdd = async () => {
    if (!title.trim()) return;
    const { error: err } = await createTask({ title, priority });
    if (!err) setTitle('');
  };

  const toggleDone = async (task: Task) => {
    const next = task.status === 'done' ? 'todo' : 'done';
    await updateTaskStatus(task.id, next);
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Tarefas</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sincronização em tempo real · {stats.pending} pendentes · {stats.done}{' '}
          concluídas
        </p>
      </header>

      <div className="glass mb-6 rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nova tarefa…"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-3 text-slate-200"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </motion.button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === f.key
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
      )}

      {loading ? (
        <p className="text-slate-500">A carregar tarefas…</p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass flex items-center gap-3 rounded-xl p-4"
              >
                <button
                  onClick={() => toggleDone(task)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                    task.status === 'done'
                      ? 'border-indigo-400 bg-indigo-500 text-white'
                      : 'border-slate-600 hover:border-indigo-400'
                  }`}
                >
                  {task.status === 'done' && <Check className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-medium ${
                      task.status === 'done'
                        ? 'text-slate-500 line-through'
                        : 'text-slate-100'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {task.description}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_STYLE[task.priority]}`}
                >
                  {PRIORITY_LABEL[task.priority]}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {!loading && tasks.length === 0 && (
            <li className="py-12 text-center text-slate-500">
              Nenhuma tarefa. Crie a primeira acima — aparece no telemóvel em segundos.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

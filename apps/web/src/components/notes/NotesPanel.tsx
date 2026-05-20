'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useNotes } from '@/hooks/useNotes';

export function NotesPanel() {
  const { notes, loading, error, createNote, deleteNote } = useNotes();
  const [title, setTitle] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) return;
    const { error: err } = await createNote({ title });
    if (!err) setTitle('');
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">Notas</h1>
        <p className="mt-1 text-sm text-slate-400">
          Markdown · caminhos Obsidian · sync com vault (Fase 2)
        </p>
      </header>

      <div className="glass mb-6 flex gap-3 rounded-2xl p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nova nota…"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Criar
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
      {loading ? (
        <p className="text-slate-500">A carregar…</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {notes.map((n) => (
              <motion.li
                key={n.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-100">{n.title}</p>
                    <p className="mt-1 font-mono text-xs text-slate-500">{n.obsidianPath}</p>
                    {n.body && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-400">{n.body}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <li className="py-12 text-center text-slate-500">Nenhuma nota ainda.</li>
          )}
        </ul>
      )}
    </div>
  );
}

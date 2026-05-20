'use client';

import { dbNoteToNote, type DbNote } from '@cortex/shared';
import type { Note } from '@cortex/shared';
import { useCallback, useEffect, useState } from 'react';

import { isDemoMode } from '@/lib/demo-mode';
import { mockStore, subscribeMockStore } from '@/lib/mock-store';
import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export function useNotes() {
  const { user } = useAuth();
  const supabase = tryCreateClient();
  const demo = isDemoMode();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    if (demo) {
      setNotes(mockStore.getNotes());
      setError(null);
      return;
    }
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (err) setError(err.message);
    else setNotes((data as DbNote[]).map(dbNoteToNote));
  }, [user, supabase, demo]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (demo) {
      fetchNotes();
      setLoading(false);
      return subscribeMockStore(fetchNotes);
    }
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchNotes().finally(() => setLoading(false));
  }, [user, supabase, demo, fetchNotes]);

  const createNote = async (input: { title: string; body?: string }) => {
    if (!user) return { error: 'Não autenticado' };
    if (demo) {
      mockStore.createNote(input);
      fetchNotes();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error: err } = await supabase.from('notes').insert({
      user_id: user.id,
      title: input.title.trim(),
      body: input.body ?? '',
      obsidian_path: `notas/${slug}.md`,
      tags: [],
    });
    if (!err) fetchNotes();
    return { error: err?.message ?? null };
  };

  const deleteNote = async (id: string) => {
    if (demo) {
      mockStore.deleteNote(id);
      fetchNotes();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const { error: err } = await supabase.from('notes').delete().eq('id', id);
    if (!err) fetchNotes();
    return { error: err?.message ?? null };
  };

  return { notes, loading, error, createNote, deleteNote, refresh: fetchNotes };
}

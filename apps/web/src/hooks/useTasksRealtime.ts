'use client';

import { dbTaskToTask, type DbTask } from '@cortex/shared';
import type { Priority, Task, TaskStatus } from '@cortex/shared';
import { useCallback, useEffect, useState } from 'react';

import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export type TaskFilter = 'all' | 'pending' | 'done';

export function useTasksRealtime(filter: TaskFilter = 'all') {
  const { user, refreshProfile } = useAuth();
  const supabase = tryCreateClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user || !supabase) return;
    setError(null);
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (filter === 'pending') {
      query = query.neq('status', 'done').neq('status', 'cancelled');
    } else if (filter === 'done') {
      query = query.eq('status', 'done');
    }

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      return;
    }
    setTasks((data as DbTask[]).map(dbTaskToTask));
  }, [user, supabase, filter]);

  useEffect(() => {
    if (!user || !supabase) {
      setTasks([]);
      setLoading(false);
      return;
    }

    fetchTasks().finally(() => setLoading(false));

    const channel = supabase
      .channel(`tasks-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks();
          refreshProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchTasks, refreshProfile]);

  const createTask = useCallback(
    async (input: {
      title: string;
      description?: string;
      priority?: Priority;
      dueAt?: string;
    }) => {
      if (!user || !supabase) return { error: 'Não autenticado' };
      const { error: err } = await supabase.from('tasks').insert({
        user_id: user.id,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        priority: input.priority ?? 'medium',
        status: 'todo',
        due_at: input.dueAt ?? null,
        tags: [],
        progress: 0,
        spent_minutes: 0,
        sort_order: 0,
      });
      if (err) return { error: err.message };
      return { error: null };
    },
    [user, supabase]
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      if (!supabase) return { error: 'Supabase não configurado' };
      const patch: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (status === 'done') {
        patch.completed_at = new Date().toISOString();
        patch.progress = 100;
      }
      const { error: err } = await supabase.from('tasks').update(patch).eq('id', id);
      return { error: err?.message ?? null };
    },
    [supabase]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!supabase) return { error: 'Supabase não configurado' };
      const { error: err } = await supabase.from('tasks').delete().eq('id', id);
      return { error: err?.message ?? null };
    },
    [supabase]
  );

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    pending: tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length,
  };

  return {
    tasks,
    loading,
    error,
    stats,
    createTask,
    updateTaskStatus,
    deleteTask,
    refresh: fetchTasks,
  };
}

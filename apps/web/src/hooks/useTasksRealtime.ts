'use client';

import { dbTaskToTask, type DbTask } from '@cortex/shared';
import type { Priority, Task, TaskStatus } from '@cortex/shared';
import { useCallback, useEffect, useState } from 'react';

import { isDemoMode } from '@/lib/demo-mode';
import { mockStore, subscribeMockStore } from '@/lib/mock-store';
import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export type TaskFilter = 'all' | 'pending' | 'done';

function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === 'pending') {
    return tasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled');
  }
  if (filter === 'done') return tasks.filter((t) => t.status === 'done');
  return tasks;
}

export function useTasksRealtime(filter: TaskFilter = 'all') {
  const { user, refreshProfile } = useAuth();
  const supabase = tryCreateClient();
  const demo = isDemoMode();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    if (demo) {
      setTasks(filterTasks(mockStore.getTasks(), filter));
      setError(null);
      return;
    }

    if (!supabase) return;
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
  }, [user, supabase, filter, demo]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    if (demo) {
      fetchTasks();
      setLoading(false);
      return subscribeMockStore(() => fetchTasks());
    }

    if (!supabase) {
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
  }, [user, supabase, fetchTasks, refreshProfile, demo]);

  const createTask = useCallback(
    async (input: {
      title: string;
      description?: string;
      priority?: Priority;
      dueAt?: string;
    }) => {
      if (!user) return { error: 'Não autenticado' };

      if (demo) {
        mockStore.createTask(input);
        fetchTasks();
        return { error: null };
      }

      if (!supabase) return { error: 'Supabase não configurado' };
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
    [user, supabase, demo, fetchTasks]
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      if (demo) {
        mockStore.updateTaskStatus(id, status);
        fetchTasks();
        return { error: null };
      }

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
      if (!err) refreshProfile();
      return { error: err?.message ?? null };
    },
    [supabase, demo, fetchTasks, refreshProfile]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (demo) {
        mockStore.deleteTask(id);
        fetchTasks();
        return { error: null };
      }
      if (!supabase) return { error: 'Supabase não configurado' };
      const { error: err } = await supabase.from('tasks').delete().eq('id', id);
      return { error: err?.message ?? null };
    },
    [supabase, demo, fetchTasks]
  );

  const all = demo ? filterTasks(mockStore.getTasks(), 'all') : tasks;
  const stats = {
    total: all.length,
    done: all.filter((t) => t.status === 'done').length,
    pending: all.filter((t) => t.status !== 'done' && t.status !== 'cancelled').length,
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

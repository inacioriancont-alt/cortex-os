'use client';

import { dbGoalToGoal, type DbGoal } from '@cortex/shared';
import type { Goal } from '@cortex/shared';
import { useCallback, useEffect, useState } from 'react';

import { isDemoMode } from '@/lib/demo-mode';
import { mockStore, subscribeMockStore } from '@/lib/mock-store';
import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export function useGoals() {
  const { user } = useAuth();
  const supabase = tryCreateClient();
  const demo = isDemoMode();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    if (demo) {
      setGoals(mockStore.getGoals());
      setError(null);
      return;
    }
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setGoals((data as DbGoal[]).map(dbGoalToGoal));
  }, [user, supabase, demo]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (demo) {
      fetchGoals();
      setLoading(false);
      return subscribeMockStore(fetchGoals);
    }
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchGoals().finally(() => setLoading(false));
  }, [user, supabase, demo, fetchGoals]);

  const createGoal = async (input: {
    title: string;
    targetValue: number;
    unit?: string;
  }) => {
    if (!user) return { error: 'Não autenticado' };
    if (demo) {
      mockStore.createGoal(input);
      fetchGoals();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const { error: err } = await supabase.from('goals').insert({
      user_id: user.id,
      title: input.title.trim(),
      target_value: input.targetValue,
      current_value: 0,
      unit: input.unit ?? 'tasks',
    });
    if (!err) fetchGoals();
    return { error: err?.message ?? null };
  };

  const incrementGoal = async (id: string) => {
    if (demo) {
      mockStore.incrementGoal(id);
      fetchGoals();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const goal = goals.find((g) => g.id === id);
    if (!goal) return { error: 'Meta não encontrada' };
    const next = Math.min(goal.targetValue, goal.currentValue + 1);
    const { error: err } = await supabase
      .from('goals')
      .update({ current_value: next })
      .eq('id', id);
    if (!err) fetchGoals();
    return { error: err?.message ?? null };
  };

  const deleteGoal = async (id: string) => {
    if (demo) {
      mockStore.deleteGoal(id);
      fetchGoals();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const { error: err } = await supabase.from('goals').delete().eq('id', id);
    if (!err) fetchGoals();
    return { error: err?.message ?? null };
  };

  return { goals, loading, error, createGoal, incrementGoal, deleteGoal, refresh: fetchGoals };
}

'use client';

import { dbFlowStepToFlowStep, dbFlowToFlow, type DbFlow, type DbFlowStep } from '@cortex/shared';
import type { Flow, FlowStep } from '@cortex/shared';
import { useCallback, useEffect, useState } from 'react';

import { isDemoMode } from '@/lib/demo-mode';
import { mockStore, subscribeMockStore } from '@/lib/mock-store';
import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export function useFlows() {
  const { user } = useAuth();
  const supabase = tryCreateClient();
  const demo = isDemoMode();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlows = useCallback(async () => {
    if (!user) return;
    if (demo) {
      const list = mockStore.getFlows();
      setFlows(list);
      setError(null);
      return;
    }
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('flows')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (err) setError(err.message);
    else setFlows((data as DbFlow[]).map(dbFlowToFlow));
  }, [user, supabase, demo]);

  useEffect(() => {
    if (flows.length > 0 && !selectedId) setSelectedId(flows[0].id);
  }, [flows, selectedId]);

  const fetchSteps = useCallback(
    async (flowId: string | null) => {
      if (!flowId) {
        setSteps([]);
        return;
      }
      if (demo) {
        setSteps(mockStore.getFlowSteps(flowId));
        return;
      }
      if (!supabase) return;
      const { data, error: err } = await supabase
        .from('flow_steps')
        .select('*')
        .eq('flow_id', flowId)
        .order('sort_order');
      if (err) setError(err.message);
      else setSteps((data as DbFlowStep[]).map(dbFlowStepToFlowStep));
    },
    [supabase, demo]
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const run = async () => {
      await fetchFlows();
      setLoading(false);
    };
    if (demo) {
      run();
      return subscribeMockStore(run);
    }
    if (!supabase) {
      setLoading(false);
      return;
    }
    run();
  }, [user, supabase, demo, fetchFlows]);

  useEffect(() => {
    fetchSteps(selectedId);
  }, [selectedId, fetchSteps]);

  const createFlow = async (input: { name: string; description?: string }) => {
    if (!user) return { error: 'Não autenticado' };
    if (demo) {
      mockStore.createFlow(input);
      await fetchFlows();
      const list = mockStore.getFlows();
      if (list[0]) setSelectedId(list[0].id);
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const { data, error: err } = await supabase
      .from('flows')
      .insert({
        user_id: user.id,
        name: input.name.trim(),
        description: input.description?.trim() || null,
      })
      .select('id')
      .single();
    if (err) return { error: err.message };
    const flowId = data.id as string;
    const labels = ['Início', 'Em curso', 'Concluído'];
    await supabase.from('flow_steps').insert(
      labels.map((label, i) => ({
        flow_id: flowId,
        label,
        position_x: i,
        position_y: 0,
        sort_order: i,
        color: '#6366f1',
      }))
    );
    setSelectedId(flowId);
    await fetchFlows();
    await fetchSteps(flowId);
    return { error: null };
  };

  const deleteFlow = async (id: string) => {
    if (demo) {
      mockStore.deleteFlow(id);
      setSelectedId(null);
      fetchFlows();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    await supabase.from('flow_steps').delete().eq('flow_id', id);
    const { error: err } = await supabase.from('flows').delete().eq('id', id);
    if (!err) {
      setSelectedId(null);
      fetchFlows();
    }
    return { error: err?.message ?? null };
  };

  return {
    flows,
    steps,
    selectedId,
    setSelectedId,
    loading,
    error,
    createFlow,
    deleteFlow,
    refresh: fetchFlows,
  };
}

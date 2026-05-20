'use client';

import { dbCompanyToCompany, type DbCompany } from '@cortex/shared';
import type { Company } from '@cortex/shared';
import { useCallback, useEffect, useState } from 'react';

import { isDemoMode } from '@/lib/demo-mode';
import { mockStore, subscribeMockStore } from '@/lib/mock-store';
import { tryCreateClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export function useCompanies() {
  const { user } = useAuth();
  const supabase = tryCreateClient();
  const demo = isDemoMode();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    if (!user) return;
    if (demo) {
      setCompanies(mockStore.getCompanies());
      setError(null);
      return;
    }
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    if (err) setError(err.message);
    else setCompanies((data as DbCompany[]).map(dbCompanyToCompany));
  }, [user, supabase, demo]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (demo) {
      fetchCompanies();
      setLoading(false);
      return subscribeMockStore(fetchCompanies);
    }
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchCompanies().finally(() => setLoading(false));
  }, [user, supabase, demo, fetchCompanies]);

  const createCompany = async (input: { name: string; description?: string }) => {
    if (!user) return { error: 'Não autenticado' };
    if (demo) {
      mockStore.createCompany(input);
      fetchCompanies();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'empresa';
    const { error: err } = await supabase.from('companies').insert({
      user_id: user.id,
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      metadata: {},
    });
    if (!err) fetchCompanies();
    return { error: err?.message ?? null };
  };

  const deleteCompany = async (id: string) => {
    if (demo) {
      mockStore.deleteCompany(id);
      fetchCompanies();
      return { error: null };
    }
    if (!supabase) return { error: 'Supabase não configurado' };
    const { error: err } = await supabase.from('companies').delete().eq('id', id);
    if (!err) fetchCompanies();
    return { error: err?.message ?? null };
  };

  return { companies, loading, error, createCompany, deleteCompany, refresh: fetchCompanies };
}

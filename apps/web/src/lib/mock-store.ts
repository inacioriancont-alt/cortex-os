import type { Company, Flow, FlowStep, Goal, Note, Task, TaskStatus } from '@cortex/shared';
import { MOCK_USER } from '@/lib/supabase/config';

const KEY = 'cortex-mock-store-v1';

type Store = {
  tasks: Task[];
  notes: Note[];
  companies: Company[];
  flows: Flow[];
  flowSteps: FlowStep[];
  goals: Goal[];
};

function uid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function seed(): Store {
  const companyId = uid();
  const flowId = uid();
  const t = now();
  const userId = MOCK_USER.id;

  const companies: Company[] = [
    {
      id: companyId,
      userId,
      name: 'Empresa Demo Lda',
      slug: 'empresa-demo',
      description: 'Cliente principal — processos RH e documentação',
      metadata: { sector: 'servicos' },
      createdAt: t,
      updatedAt: t,
    },
  ];

  const flowSteps: FlowStep[] = [
    { id: uid(), flowId, label: 'Admissão', positionX: 0, positionY: 0, sortOrder: 0, color: '#6366f1' },
    { id: uid(), flowId, label: 'Documentação', positionX: 1, positionY: 0, sortOrder: 1, color: '#8b5cf6' },
    { id: uid(), flowId, label: 'Assinatura', positionX: 2, positionY: 0, sortOrder: 2, color: '#a855f7' },
    { id: uid(), flowId, label: 'Cadastro', positionX: 3, positionY: 0, sortOrder: 3, color: '#d946ef' },
  ];

  const flows: Flow[] = [
    {
      id: flowId,
      userId,
      name: 'Onboarding RH',
      description: 'Fluxo de admissão de colaboradores',
      companyId,
      createdAt: t,
      updatedAt: t,
    },
  ];

  const tasks: Task[] = [
    {
      id: uid(),
      userId,
      title: 'Revisar documentação cliente',
      status: 'todo',
      priority: 'urgent',
      dueAt: new Date().toISOString(),
      tags: ['cliente'],
      spentMinutes: 0,
      progress: 0,
      sortOrder: 0,
      companyId,
      flowId,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: uid(),
      userId,
      title: 'Sync vault Obsidian',
      status: 'in_progress',
      priority: 'medium',
      tags: ['obsidian'],
      spentMinutes: 30,
      progress: 40,
      sortOrder: 1,
      createdAt: t,
      updatedAt: t,
    },
    {
      id: uid(),
      userId,
      title: 'Relatório semanal concluído',
      status: 'done',
      priority: 'low',
      completedAt: t,
      tags: [],
      spentMinutes: 120,
      progress: 100,
      sortOrder: 2,
      createdAt: t,
      updatedAt: t,
    },
  ];

  const notes: Note[] = [
    {
      id: uid(),
      userId,
      title: 'Template — Reunião cliente',
      body: '# Reunião\n\n## Participantes\n\n## Decisões\n',
      obsidianPath: 'notas/reuniao-cliente.md',
      tags: ['template'],
      companyId,
      createdAt: t,
      updatedAt: t,
    },
  ];

  const goals: Goal[] = [
    {
      id: uid(),
      userId,
      title: 'Concluir 20 tarefas este mês',
      targetValue: 20,
      currentValue: 1,
      unit: 'tasks',
      createdAt: t,
    },
    {
      id: uid(),
      userId,
      title: 'Streak de 7 dias',
      targetValue: 7,
      currentValue: 5,
      unit: 'days',
      createdAt: t,
    },
  ];

  return { tasks, notes, companies, flows, flowSteps, goals };
}

function load(): Store {
  if (typeof window === 'undefined') return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Store;
  } catch {
    return seed();
  }
}

function save(store: Store): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent('cortex-mock-update'));
}

export function subscribeMockStore(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener('cortex-mock-update', handler);
  return () => window.removeEventListener('cortex-mock-update', handler);
}

export const mockStore = {
  getTasks(): Task[] {
    return load().tasks;
  },
  createTask(input: { title: string; priority?: Task['priority']; dueAt?: string }): void {
    const s = load();
    const t = now();
    s.tasks.unshift({
      id: uid(),
      userId: MOCK_USER.id,
      title: input.title.trim(),
      status: 'todo',
      priority: input.priority ?? 'medium',
      dueAt: input.dueAt,
      tags: [],
      spentMinutes: 0,
      progress: 0,
      sortOrder: 0,
      createdAt: t,
      updatedAt: t,
    });
    save(s);
  },
  updateTaskStatus(id: string, status: TaskStatus): void {
    const s = load();
    const task = s.tasks.find((x) => x.id === id);
    if (!task) return;
    task.status = status;
    task.updatedAt = now();
    if (status === 'done') {
      task.completedAt = now();
      task.progress = 100;
    } else {
      task.completedAt = undefined;
      task.progress = 0;
    }
    save(s);
  },
  deleteTask(id: string): void {
    const s = load();
    s.tasks = s.tasks.filter((x) => x.id !== id);
    save(s);
  },

  getNotes(): Note[] {
    return load().notes;
  },
  createNote(input: { title: string; body?: string }): void {
    const s = load();
    const t = now();
    const slug = input.title.toLowerCase().replace(/\s+/g, '-').slice(0, 40);
    s.notes.unshift({
      id: uid(),
      userId: MOCK_USER.id,
      title: input.title.trim(),
      body: input.body ?? '',
      obsidianPath: `notas/${slug}.md`,
      tags: [],
      createdAt: t,
      updatedAt: t,
    });
    save(s);
  },
  deleteNote(id: string): void {
    const s = load();
    s.notes = s.notes.filter((x) => x.id !== id);
    save(s);
  },

  getCompanies(): Company[] {
    return load().companies;
  },
  createCompany(input: { name: string; description?: string }): void {
    const s = load();
    const t = now();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    s.companies.unshift({
      id: uid(),
      userId: MOCK_USER.id,
      name: input.name.trim(),
      slug: slug || 'empresa',
      description: input.description,
      metadata: {},
      createdAt: t,
      updatedAt: t,
    });
    save(s);
  },
  deleteCompany(id: string): void {
    const s = load();
    s.companies = s.companies.filter((x) => x.id !== id);
    save(s);
  },

  getFlows(): Flow[] {
    return load().flows;
  },
  getFlowSteps(flowId: string): FlowStep[] {
    return load().flowSteps.filter((x) => x.flowId === flowId).sort((a, b) => a.sortOrder - b.sortOrder);
  },
  createFlow(input: { name: string; description?: string }): void {
    const s = load();
    const t = now();
    const flowId = uid();
    s.flows.unshift({
      id: flowId,
      userId: MOCK_USER.id,
      name: input.name.trim(),
      description: input.description,
      createdAt: t,
      updatedAt: t,
    });
    ['Início', 'Em curso', 'Concluído'].forEach((label, i) => {
      s.flowSteps.push({
        id: uid(),
        flowId,
        label,
        positionX: i,
        positionY: 0,
        sortOrder: i,
        color: '#6366f1',
      });
    });
    save(s);
  },
  deleteFlow(id: string): void {
    const s = load();
    s.flows = s.flows.filter((x) => x.id !== id);
    s.flowSteps = s.flowSteps.filter((x) => x.flowId !== id);
    save(s);
  },

  getGoals(): Goal[] {
    return load().goals;
  },
  createGoal(input: { title: string; targetValue: number; unit?: string }): void {
    const s = load();
    s.goals.unshift({
      id: uid(),
      userId: MOCK_USER.id,
      title: input.title.trim(),
      targetValue: input.targetValue,
      currentValue: 0,
      unit: input.unit ?? 'tasks',
      createdAt: now(),
    });
    save(s);
  },
  incrementGoal(id: string, delta = 1): void {
    const s = load();
    const g = s.goals.find((x) => x.id === id);
    if (!g) return;
    g.currentValue = Math.min(g.targetValue, g.currentValue + delta);
    save(s);
  },
  deleteGoal(id: string): void {
    const s = load();
    s.goals = s.goals.filter((x) => x.id !== id);
    save(s);
  },
};

import type {
  Company,
  Flow,
  FlowStep,
  GamificationEvent,
  Goal,
  Note,
  Priority,
  Task,
  TaskStatus,
} from './types';

/** Linha da tabela `tasks` no Supabase */
export type DbTask = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_at: string | null;
  start_at: string | null;
  completed_at: string | null;
  parent_id: string | null;
  project_id: string | null;
  company_id: string | null;
  flow_id: string | null;
  flow_step_id: string | null;
  obsidian_path: string | null;
  tags: string[];
  estimate_minutes: number | null;
  spent_minutes: number;
  progress: number;
  recurrence_rule: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export function dbTaskToTask(row: DbTask): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? '',
    status: row.status,
    priority: row.priority,
    dueAt: row.due_at ?? undefined,
    startAt: row.start_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    parentId: row.parent_id ?? undefined,
    projectId: row.project_id ?? undefined,
    companyId: row.company_id ?? undefined,
    flowId: row.flow_id ?? undefined,
    flowStepId: row.flow_step_id ?? undefined,
    obsidianPath: row.obsidian_path ?? undefined,
    tags: row.tags ?? [],
    estimateMinutes: row.estimate_minutes ?? undefined,
    spentMinutes: row.spent_minutes,
    progress: row.progress,
    recurrenceRule: row.recurrence_rule ?? undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function taskToDbInsert(
  task: Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'dueAt' | 'tags'>,
  userId: string
): Partial<DbTask> {
  return {
    user_id: userId,
    title: task.title,
    description: task.description || null,
    priority: task.priority,
    status: task.status ?? 'todo',
    due_at: task.dueAt ?? null,
    tags: task.tags ?? [],
    progress: 0,
    spent_minutes: 0,
    sort_order: 0,
  };
}

export type DbNote = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  obsidian_path: string;
  tags: string[];
  company_id: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

export function dbNoteToNote(row: DbNote): Note {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    obsidianPath: row.obsidian_path,
    tags: row.tags ?? [],
    companyId: row.company_id ?? undefined,
    projectId: row.project_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type DbCompany = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export function dbCompanyToCompany(row: DbCompany): Company {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type DbFlow = {
  id: string;
  user_id: string;
  company_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export function dbFlowToFlow(row: DbFlow): Flow {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description ?? undefined,
    companyId: row.company_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type DbFlowStep = {
  id: string;
  flow_id: string;
  label: string;
  position_x: number;
  position_y: number;
  sort_order: number;
  color: string | null;
};

export function dbFlowStepToFlowStep(row: DbFlowStep): FlowStep {
  return {
    id: row.id,
    flowId: row.flow_id,
    label: row.label,
    positionX: row.position_x,
    positionY: row.position_y,
    sortOrder: row.sort_order,
    color: row.color ?? undefined,
  };
}

export type DbGoal = {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  due_at: string | null;
  created_at: string;
};

export function dbGoalToGoal(row: DbGoal): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    targetValue: row.target_value,
    currentValue: row.current_value,
    unit: row.unit,
    dueAt: row.due_at ?? undefined,
    createdAt: row.created_at,
  };
}

export type DbGamificationEvent = {
  id: string;
  user_id: string;
  type: string;
  xp_earned: number;
  payload: Record<string, unknown>;
  created_at: string;
};

export function dbEventToEvent(row: DbGamificationEvent): GamificationEvent {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as GamificationEvent['type'],
    xpEarned: row.xp_earned,
    payload: row.payload ?? {},
    createdAt: row.created_at,
  };
}

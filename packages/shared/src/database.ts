import type { Priority, Task, TaskStatus } from './types';

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

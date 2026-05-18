/** Entidades centrais — espelham o schema Supabase */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type ViewMode = 'list' | 'kanban' | 'calendar' | 'timeline';

export interface Profile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streakDays: number;
  obsidianVaultPath?: string;
  obsidianVaultName?: string;
  timezone: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueAt?: string;
  startAt?: string;
  completedAt?: string;
  parentId?: string;
  projectId?: string;
  companyId?: string;
  flowId?: string;
  flowStepId?: string;
  obsidianPath?: string;
  tags: string[];
  estimateMinutes?: number;
  spentMinutes: number;
  progress: number;
  recurrenceRule?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  body: string;
  obsidianPath: string;
  tags: string[];
  companyId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Flow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlowStep {
  id: string;
  flowId: string;
  label: string;
  positionX: number;
  positionY: number;
  sortOrder: number;
  color?: string;
}

export interface FlowEdge {
  id: string;
  flowId: string;
  fromStepId: string;
  toStepId: string;
}

export interface GamificationEvent {
  id: string;
  userId: string;
  type: 'task_completed' | 'streak' | 'level_up' | 'focus_session';
  xpEarned: number;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardWidget {
  id: string;
  type:
    | 'tasks_today'
    | 'calendar'
    | 'urgent'
    | 'goals'
    | 'productivity_week'
    | 'notifications'
    | 'flows'
    | 'xp';
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
}

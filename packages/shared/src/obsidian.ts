import type { Priority, Task, TaskStatus } from './types';

const STATUS_CHECK: Record<TaskStatus, string> = {
  todo: ' ',
  in_progress: '/',
  blocked: '!',
  done: 'x',
  cancelled: '-',
};

const PRIORITY_TAG: Record<Priority, string> = {
  low: 'prioridade/baixa',
  medium: 'prioridade/media',
  high: 'prioridade/alta',
  urgent: 'prioridade/urgente',
};

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
    .toLowerCase();
}

export function taskObsidianPath(task: Pick<Task, 'title'>, folder = 'Cortex/Tarefas'): string {
  return `${folder.replace(/\/$/, '')}/${slugify(task.title) || 'tarefa'}.md`;
}

export function taskToMarkdown(
  task: Task,
  links: { companies?: string[]; projects?: string[]; notes?: string[] } = {}
): string {
  const wikilinks = [
    ...(links.companies ?? []).map((n) => `[[Empresas/${n}]]`),
    ...(links.projects ?? []).map((n) => `[[Projetos/${n}]]`),
    ...(links.notes ?? []).map((n) => (n.startsWith('[[') ? n : `[[${n}]]`)),
  ];

  const lines = [
    '---',
    `cortex_id: ${task.id}`,
    `title: "${task.title.replace(/"/g, '\\"')}"`,
    `status: ${task.status}`,
    `priority: ${task.priority}`,
    `progress: ${task.progress}`,
    `tags: [cortex, tarefa, ${PRIORITY_TAG[task.priority]}${task.tags.length ? ', ' + task.tags.map((t) => JSON.stringify(t)).join(', ') : ''}]`,
  ];

  if (task.dueAt) lines.push(`due: ${task.dueAt}`);
  if (task.obsidianPath) lines.push(`note_path: "${task.obsidianPath}"`);
  if (wikilinks.length) lines.push(`related: [${wikilinks.join(', ')}]`);

  lines.push('---', '', `# ${task.title}`, '');

  if (task.description?.trim()) {
    lines.push('## Descrição', '', task.description.trim(), '');
  }

  lines.push('## Checklist', '', `- [${STATUS_CHECK[task.status]}] ${task.title}`, '');

  if (wikilinks.length) {
    lines.push('## Ligações', '', ...wikilinks.map((l) => `- ${l}`), '');
  }

  return lines.join('\n');
}

export function parseFrontmatter(markdown: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: markdown };

  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2] };
}

export function buildObsidianUri(vault: string, filePath: string): string {
  return `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(filePath.replace(/\\/g, '/'))}`;
}

import {
  Building2,
  Calendar,
  FileText,
  GitBranch,
  LayoutDashboard,
  Settings,
  Target,
  CheckSquare,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export const MAIN_NAV: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tarefas', label: 'Tarefas', icon: CheckSquare },
  { href: '/calendario', label: 'Calendário', icon: Calendar },
  { href: '/fluxos', label: 'Fluxos', icon: GitBranch },
  { href: '/empresas', label: 'Empresas', icon: Building2 },
  { href: '/notas', label: 'Notas', icon: FileText },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/metas', label: 'Metas', icon: Target },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

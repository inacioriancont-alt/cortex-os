# Cortex OS — Roadmap

## Visão
Sistema operacional de produtividade pessoal e empresarial com integração profunda ao Obsidian, sync em tempo real e experiência premium (web, desktop Windows, mobile).

## Arquitetura

| Camada | Tecnologia |
|--------|------------|
| Web | Next.js 16 + Tailwind + Framer Motion |
| Desktop | Electron (wrapper da web) — Fase 3 |
| Mobile | Expo / React Native (`gestao-tarefas` → `@cortex/mobile`) |
| Backend | Supabase (Postgres, Auth, Realtime, Storage) |
| Partilhado | `@cortex/shared` (tipos, Obsidian, gamificação) |
| Obsidian | Ficheiros `.md` no vault + URI + sync bidirecional |

## Fases

### Fase 1 — Fundação (atual)
- [x] Monorepo `cortex-os`
- [x] Dashboard web com UI moderna (glassmorphism, XP demo)
- [x] Menu completo (9 secções)
- [x] Schema Supabase (`supabase/schema.sql`)
- [x] Pacote Obsidian (markdown + frontmatter)
- [ ] Auth Supabase + perfil
- [ ] CRUD tarefas com Realtime

### Fase 2 — Tarefas + Obsidian
- CRUD completo, subtarefas, tags, anexos
- Sync vault: ler/escrever `.md` no Windows
- Nota automática por tarefa + backlinks
- App mobile ligado ao Supabase
- Gamificação (XP, streak, animações)

### Fase 3 — Calendário + Desktop + Notificações
- Calendário drag-and-drop, Google Calendar
- Electron Windows
- Push desktop + mobile
- Modo foco + cronómetro

### Fase 4 — Fluxos + Empresas
- Editor visual de fluxos (React Flow)
- Módulo empresas/clientes
- Mapa de ligações (grafo)

### Fase 5 — Inteligência + IA
- Priorização automática
- Relatórios e metas
- Sugestões IA (resumos, previsão de atrasos)

## Como correr a web

```powershell
cd C:\Users\inaci\projects\cortex-os
npm install
npm.cmd run dev:web
```

Abrir http://localhost:3000

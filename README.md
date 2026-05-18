# Cortex OS

Plataforma de produtividade integrada ao Obsidian — segundo cérebro digital.

## Stack

- **Web:** Next.js 16 + Tailwind + Supabase (Auth + Realtime)
- **Mobile:** Expo / React Native ([gestao-tarefas](https://github.com/SEU_USUARIO/gestao-tarefas))
- **Shared:** `@cortex/shared` (tipos, Obsidian, gamificação)

## Começar

```powershell
npm install
cd apps\web
copy .env.local.example .env.local
# Preencher chaves Supabase
cd ..\..
npm run dev:web
```

Documentação Supabase: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

## Estrutura

```
apps/web/          # Dashboard web
packages/shared/   # Código partilhado
supabase/          # Schema SQL
docs/              # Roadmap e guias
```

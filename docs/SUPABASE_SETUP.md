# Configurar Supabase (Fase 2A)

## 1. Criar projeto

1. Aceda a [supabase.com](https://supabase.com) e crie um projeto.
2. Anote **Project URL** e **anon public key** (Settings → API).

## 2. Executar SQL

No **SQL Editor**, execute por ordem:

1. `supabase/schema.sql`
2. `supabase/migrations/002_auth_and_policies.sql`

## 3. Auth (recomendado para desenvolvimento)

Em **Authentication → Providers → Email**:

- Desative **Confirm email** (para testar sem confirmação), ou
- Use o link de confirmação no e-mail ao registar.

## 4. Realtime

Em **Database → Publications**, confirme que `supabase_realtime` inclui a tabela `tasks`.

## 5. Variáveis no projeto web

```powershell
cd apps\web
copy .env.local.example .env.local
```

Edite `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

## 6. Arrancar

```powershell
cd C:\Users\inaci\projects\cortex-os
npm.cmd run dev:web
```

Registe-se em `/signup`, entre em `/login` e crie tarefas em **Tarefas**.

## 7. Mobile (mesma conta)

No app `gestao-tarefas`, configure as mesmas variáveis em `.env` (ver `.env.example`).

# Configurar Supabase (login + base de dados)

## Opção A — Script automático (Windows)

```powershell
cd C:\Users\inaci\projects\cortex-os
npm run supabase:setup
```

O script pede **Project URL**, **anon key** e (opcionalmente) o **project ref** para enviar as migrations.

---

## Opção B — Manual (passo a passo)

### 1. Criar projeto

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Anote em **Settings → API**:
   - **Project URL**
   - **anon public** key
3. Anote o **Reference ID** em **Settings → General**

### 2. Enviar schema (CLI)

```powershell
cd C:\Users\inaci\projects\cortex-os
npm run supabase:login
npm run supabase:link
# quando pedir, cole o Reference ID do projeto
npm run supabase:push
```

Isto aplica as migrations em `supabase/migrations/`:

- `20250101000000_initial_schema.sql` — tabelas, RLS, realtime
- `20250101000001_auth_and_policies.sql` — perfil ao registar, XP em tarefas
- `20250101000002_full_rls.sql` — RLS para notas, empresas, fluxos, metas, etc.

**Alternativa sem CLI:** no **SQL Editor**, execute por ordem:

1. `supabase/schema.sql`
2. `supabase/migrations/20250101000001_auth_and_policies.sql`

### 3. Auth (URLs de redirect)

Em **Authentication → URL Configuration**:

| Campo | Valor |
|--------|--------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

Em **Authentication → Providers → Email**, para desenvolvimento:

- Desative **Confirm email** (entrada imediata após registo)

### 4. Variáveis no projeto web

```powershell
cd apps\web
copy .env.local.example .env.local
```

Edite `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 5. Testar

```powershell
cd C:\Users\inaci\projects\cortex-os
npm run dev:web
```

1. Abra http://localhost:3000/signup — crie uma conta
2. Entre em http://localhost:3000/login
3. Crie tarefas em **Tarefas**

---

Guia completo de deploy: **`docs/DEPLOY.md`**

## Produção (Vercel / domínio próprio)

No Supabase, adicione também:

- Site URL: `https://seu-dominio.com`
- Redirect: `https://seu-dominio.com/auth/callback`

Nas variáveis de ambiente do deploy, use as mesmas `NEXT_PUBLIC_SUPABASE_*`.

---

## Mobile

No app `gestao-tarefas`, use as mesmas variáveis (ver `.env.example`).

---

## Erro `{"error":"requested path is invalid"}`

Quase sempre é **URL errada** no `.env.local` ou redirect mal configurado.

### Corrigir `.env.local`

Em [Settings → API](https://supabase.com/dashboard/project/_/settings/api):

| Campo no painel | Variável no `.env.local` |
|-----------------|---------------------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

Exemplo **correto**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Errado** (causa o erro):

- `NEXT_PUBLIC_SUPABASE_URL=1` ou valor incompleto
- Link do dashboard: `https://supabase.com/dashboard/project/...`
- URL com caminho: `...supabase.co/rest/v1` ou `.../auth/v1`
- Abrir `https://xxx.supabase.co` no browser (página vazia com esse JSON é normal)

Depois de editar, reinicie: `npm run dev:web`

### Redirects no painel

**Authentication → URL Configuration**

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

Não use a URL `*.supabase.co` como Site URL da app.

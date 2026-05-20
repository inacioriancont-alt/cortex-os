# Publicar o beta online (Vercel + Supabase)

A forma mais simples para testar noutros PCs, telemóvel ou partilhar com outras pessoas.

## 1. Supabase (produção)

No [painel Supabase](https://supabase.com/dashboard) → **Authentication → URL Configuration**:

| Campo | Valor (exemplo) |
|--------|------------------|
| Site URL | `https://SEU-PROJETO.vercel.app` |
| Redirect URLs | `https://SEU-PROJETO.vercel.app/auth/callback` |

Podes adicionar **vários** redirects (localhost + Vercel):

```
http://localhost:3000/auth/callback
https://SEU-PROJETO.vercel.app/auth/callback
```

Confirma que as migrations estão aplicadas:

```powershell
npm run supabase:push
```

---

## 2. Deploy na Vercel (recomendado)

### Opção A — Site (sem CLI)

1. Código no **GitHub** (push do repositório `cortex-os`)
2. [vercel.com/new](https://vercel.com/new) → Import do repositório
3. **Root Directory:** `apps/web` (importante no monorepo)
4. **Environment Variables:**

| Nome | Valor |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (chave **anon**, não service_role) |

5. **Deploy**

O ficheiro `apps/web/vercel.json` já configura o install/build a partir da raiz do monorepo.

### Opção B — CLI

```powershell
npm i -g vercel
cd C:\Users\inaci\projects\cortex-os\apps\web
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel --prod
```

---

## 3. Testar noutros dispositivos

1. Abre o URL que a Vercel dá (ex: `https://cortex-os-xxx.vercel.app`)
2. **Registo** em `/signup` ou login
3. O mesmo utilizador vê os mesmos dados em qualquer PC (dados no Supabase)

**Modo demo** só funciona no browser onde entraste com `demo@cortex.os` (cookie local) — para testes multi-dispositivo usa **conta Supabase real**.

---

## 4. Atualizar o beta

Cada `git push` na branch ligada à Vercel gera um deploy automático (se o repo estiver ligado).

Ou manualmente:

```powershell
cd apps\web
vercel --prod
```

---

## 5. Problemas comuns

| Problema | Solução |
|----------|---------|
| Login redireciona com erro | Adicionar URL Vercel em Supabase → Redirect URLs |
| `requested path is invalid` | `.env` na Vercel com URL `https://ref.supabase.co` (sem paths extra) |
| Build falha no monorepo | Root Directory = `apps/web` |
| Notas/empresas não gravam | `npm run supabase:push` (migration `20250101000002_full_rls.sql`) |

---

## Alternativas à Vercel

- **Netlify** — Root `apps/web`, build `npm run build:web` na raiz
- **Railway / Render** — Docker ou Node; definir as mesmas env vars

Para um beta rápido, **Vercel + Supabase** é o caminho mais direto.

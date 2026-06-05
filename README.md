# DevFolio — Plataforma de Portfólios

Plataforma full-stack onde **vários programadores** se cadastram, montam seu
portfólio e o publicam em `/u/:username`. Frontend em **React + Vite + Tailwind v4**
(minimalista/clean) e backend em **Node + Express** seguindo **Clean Architecture**,
com **Supabase** para banco de dados, autenticação e storage.

```
portfolio/
├── client/   → React + Vite + Tailwind (a vitrine + dashboard)
└── server/   → Node + Express + Clean Architecture (a API)
```

## Como funciona

- **Cadastro/login** via Supabase Auth — cada dev tem uma conta.
- **Dashboard privado** (`/dashboard`) para gerenciar projetos, skills e perfil.
- **Portfólio público** em `/u/:username` listando os projetos publicados.
- Um trigger no banco cria o perfil automaticamente quando o usuário se cadastra.

## Rodando localmente

### 0. Supabase

Crie um projeto em [supabase.com](https://supabase.com) e, no **SQL Editor**,
rode as migrations em ordem:

```
server/supabase/migrations/0001_initial_schema.sql   # tabelas, RLS, triggers
server/supabase/migrations/0002_storage_buckets.sql  # buckets de imagens
server/supabase/migrations/0003_seed_tags.sql        # catálogo de tags
```

Pegue as chaves em **Project Settings > API**:
- `URL` e `service_role key` → backend
- `URL` e `anon key` → frontend

### 1. Backend

```bash
cd server
npm install
cp .env.example .env     # preencha SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
npm run dev              # sobe em http://localhost:3333
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env     # preencha VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL
npm run dev              # sobe em http://localhost:5173
```

Abra `http://localhost:5173`, crie sua conta, adicione projetos no dashboard e
veja seu portfólio em `http://localhost:5173/u/seu-username`.

## Onde editar o quê

| Quero mudar...            | Arquivo                                  |
|---------------------------|------------------------------------------|
| Cores / fontes            | `client/src/index.css` (bloco `@theme`)  |
| Textos da landing         | `client/src/pages/LandingPage.jsx`       |
| Catálogo de tags          | `server/supabase/migrations/0003_seed_tags.sql` |
| Regras de validação       | `server/src/domain/entities/*.js`        |
| Schema / RLS do banco     | `server/supabase/migrations/*.sql`       |

## Backend — as 4 camadas (Clean Architecture)

```
server/src/
├── domain/          → entidades + regras puras (Profile, Project, Skill)
├── application/     → use cases e contratos (IProjectRepository, etc.)
├── presentation/    → controllers, rotas, middlewares (auth, erros)
├── infrastructure/  → implementações Supabase (repositórios, client)
├── app.js           → Composition Root (injeção de dependência)
└── server.js        → ponto de entrada
```

**A ideia central:** o use case depende de *contratos* (`IProjectRepository`,
`IProfileRepository`...), nunca de implementações. Hoje os dados vivem no
**Supabase**; trocar por outro banco é criar classes novas que respeitem o
contrato e mudar **uma seção** do `app.js`. O resto não se mexe.

```bash
cd server && npm test   # testa os use cases sem Express e sem banco
```

### Endpoints

```
# Públicos
GET  /api/tags
GET  /api/users/:username
GET  /api/users/:username/projects/:slug

# Privados (Authorization: Bearer <jwt do Supabase>)
GET  /api/me              PUT /api/me
GET  /api/me/projects     POST /api/me/projects
PUT  /api/me/projects/:id DELETE /api/me/projects/:id
PUT  /api/me/projects/reorder
PUT  /api/me/skills
```

## Deploy

- **Frontend** → Vercel ou Netlify (detecta Vite na hora). Configure
  `VITE_API_URL`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- **Backend** → **Render**, **Railway** ou **Fly.io** (free tiers). Configure
  `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `CORS_ORIGIN` (domínio do front).

## Próximos passos (ideias)

- Upload de avatar/capa direto pro Supabase Storage (buckets já configurados).
- Drag-and-drop para reordenar projetos (endpoint `reorder` já existe).
- Markdown na descrição longa, modo claro/escuro, página de descoberta de devs.

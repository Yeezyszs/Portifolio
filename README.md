# Portfólio

Esqueleto de portfólio full-stack. Frontend em **React + Vite + Tailwind v4**
(minimalista/clean) e backend em **Node + Express** seguindo **Clean Architecture**.

```
portfolio/
├── client/   → React + Vite + Tailwind (a vitrine)
└── server/   → Node + Express + Clean Architecture (a API de contato)
```

## Rodando localmente

Abra dois terminais.

**1. Backend**
```bash
cd server
npm install
cp .env.example .env
npm run dev          # sobe em http://localhost:3333
```

**2. Frontend**
```bash
cd client
npm install
cp .env.example .env
npm run dev          # sobe em http://localhost:5173
```

Abra `http://localhost:5173`. O formulário de contato chama a API e ela loga a
mensagem no terminal do backend.

## Onde editar o quê

| Quero mudar...            | Arquivo                                  |
|---------------------------|------------------------------------------|
| Meus projetos             | `client/src/data/projects.js`            |
| Minhas skills             | `client/src/data/skills.js`              |
| Textos do "Sobre"/Hero    | `client/src/sections/About.jsx` / `Hero.jsx` |
| Cores / fontes            | `client/src/index.css` (bloco `@theme`)  |
| Regras de validação       | `server/src/domain/entities/ContactMessage.js` |

## Backend — as 4 camadas (Clean Architecture)

```
server/src/
├── domain/          → entidades + regras de negócio puras (não conhece nada externo)
├── application/     → use cases, DTOs e contratos (interfaces)
├── presentation/    → controllers e rotas (traduz HTTP <-> aplicação)
├── infrastructure/  → implementações concretas (repo, notificação, config)
├── app.js           → Composition Root (injeção de dependência)
└── server.js        → ponto de entrada
```

**A ideia central:** o use case depende de *contratos* (`IMessageRepository`,
`INotificationService`), nunca de implementações. Hoje a mensagem é guardada em
memória e logada no console; trocar por **Supabase + e-mail** é só criar uma classe
nova que respeite o contrato e mudar **uma linha** no `app.js`. O resto não se mexe.

```bash
cd server && npm test   # testa o use case sem Express e sem banco
```

## Deploy

- **Frontend** → Vercel ou Netlify (detecta Vite na hora). Configure a env var
  `VITE_API_URL` apontando pra URL pública da API.
- **Backend** → Vercel/Netlify são ótimos pro front estático, mas um Express de
  longa duração roda melhor em **Render**, **Railway** ou **Fly.io** (free tiers).
  Alternativa: adaptar o `app.js` como *serverless function* na própria Vercel.
  Não esqueça de ajustar `CORS_ORIGIN` no backend pro domínio do front.

## Próximos passos (ideias)

- Mover os projetos pra um endpoint `GET /api/projects` (vira um 2º use case e
  mostra ainda mais o full-stack).
- `SupabaseMessageRepository` no lugar do `InMemory`.
- Modo escuro, página de detalhe por projeto, animações com Motion.

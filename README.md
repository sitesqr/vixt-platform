# VIXT Central — Ecossistema de Aplicativos

> **VIXT — Tecnologia que simplifica o seu dia a dia.**

Plataforma central do ecossistema VIXT: catálogo público de aplicativos
gratuitos, páginas individuais, acesso à versão web, estatísticas sem PII e
painel administrativo protegido.

**Status:** em produção em https://vixt-central.onrender.com

## O que está implementado

- Portal público com identidade visual VIXT (design system próprio).
- Catálogo 100% dinâmico (Prisma/PostgreSQL), com pesquisa, filtros, ordenação
  e paginação no servidor.
- Páginas individuais com descrição, funcionalidades, versões, requisitos,
  botão de acesso à versão web e — quando configurado — botão **"Baixar no
  celular (PWA)"** daquele aplicativo.
- Links de acesso cadastrados no painel; redirecionamento seguro pelo backend.
- Estatísticas de VISUALIZAÇÃO e CLIQUE sem login e sem PII.
- Painel administrativo em `/admin` com Argon2id + JWT em cookie HttpOnly,
  dashboard com Recharts e CRUD de aplicativos, categorias, banners e conteúdo.
- SEO: metadados dinâmicos, Open Graph, JSON-LD, sitemap.xml, robots.txt.
- Testes automatizados (Vitest) e validação Zod em todas as entradas.

## O que NÃO existe nesta versão

- Nenhum download: sem APK, sem PWA instalável, sem Desktop/Windows, sem
  instaladores e sem arquivos para baixar.
- Nenhum marketplace de terceiros, pagamento, assinatura ou login de visitante.
- Nenhum aplicativo existente foi reconstruído ou modificado.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 4 + CSS vars (VIXT DS) |
| ORM | Prisma 6.19.3 |
| Banco | PostgreSQL (Neon em produção) |
| Auth | Argon2id + JWT HS256 (`jose`) em cookie HttpOnly |
| Validação | Zod |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Testes | Vitest |
| Deploy | Render |

## Comece aqui

```bash
cd vixt-platform
npm install
cp .env.example .env
# Edite .env: DATABASE_URL, DIRECT_DATABASE_URL, JWT_SECRET, ANALYTICS_SALT
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Abra http://localhost:3000 e http://localhost:3000/admin/login.

### Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção local |
| `npm test` | Testes unitários |
| `npm run typecheck` | Verificação de tipos |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Aplica migrations |
| `npm run db:dev` | Cria nova migration |
| `npm run db:seed` | Seed idempotente |
| `npm run db:generate` | Gera Prisma Client |

## Documentação

- [ARCHITECTURE.md](./ARCHITECTURE.md) — decisões e estrutura de módulos
- [DATABASE.md](./DATABASE.md) — modelo de dados, migrations, backup
- [API.md](./API.md) — contratos das rotas REST
- [DEPLOY.md](./DEPLOY.md) — implantação no Render
- [SECURITY.md](./SECURITY.md) — segurança e LGPD
- [CHANGELOG.md](./CHANGELOG.md) — histórico de decisões

# VIXT Central — Ecossistema de Aplicativos

> **VIXT — Tecnologia que simplifica o seu dia a dia.**

Plataforma central do ecossistema VIXT: catálogo público de aplicativos gratuitos,
páginas individuais, distribuição controlada, estatísticas sem PII e painel
administrativo protegido.

**Status:** Fase 1 (Fundação) + Fase 2 e 3 estruturadas e funcionais.
**Importante:** nenhum deploy em produção foi realizado.

---

## O que está implementado

- Portal público com identidade visual VIXT (design system próprio).
- Catálogo 100% dinâmico (Prisma/PostgreSQL), com pesquisa, filtros, ordenação
  e paginação no servidor.
- Páginas individuais por aplicativo com versões, funcionalidades, galeria,
  suporte e botões de distribuição **somente quando há link ativo válido**.
- Sistema de distribuição: WEB, PLAY_STORE, APK, PWA, DESKTOP, OTHER —
  um app pode ter vários links; redirecionamento passa sempre pelo backend.
- Controle de versões com changelog e status de publicação.
- Estatísticas de VIEW / CLICK / DOWNLOAD sem login e sem IP bruto persistido.
- Painel administrativo em `/admin` com login Argon2id + JWT em cookie HttpOnly,
  proteção no proxy **e** no backend, dashboard com Recharts, CRUD de
  aplicativos, categorias, banners e conteúdo institucional.
- SEO: metadados dinâmicos, Open Graph, JSON-LD, sitemap.xml, robots.txt.
- Testes automatizados (Vitest) e validação com Zod em todas as entradas.

## O que NÃO está implementado (por decisão de escopo)

- Marketplace de terceiros (modelo de dados preparado, nenhuma rota/UI ativa).
- Pagamentos, assinaturas, cadastro ou login de visitantes.
- Reconstrução ou alteração dos aplicativos VIXT existentes.
- Abertura pública de chamados de suporte (estrutura futura documentada).
- Upload de arquivos (Fase 1 usa URLs externas; storage planejado para S3/R2).

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 4 + CSS vars (VIXT DS) |
| ORM | Prisma 6.19.3 (pinned; ver CHANGELOG) |
| Banco | PostgreSQL (Neon em produção) |
| Auth | Argon2id + JWT HS256 (`jose`) em cookie HttpOnly |
| Validação | Zod |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Testes | Vitest |
| Deploy | Render (compatível) |

##Comece aqui

```bash
cd vixt-platform
npm install
cp .env.example .env
# Edite .env: DATABASE_URL, DIRECT_DATABASE_URL, JWT_SECRET, ANALYTICS_SALT
npm run db:generate
npm run db:migrate
npm run db:seed       # opcional: cria admin e dados iniciais
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
| `npm run db:dev` | Cria nova migration em desenvolvimento |
| `npm run db:seed` | Seed idempotente |
| `npm run db:generate` | Gera Prisma Client |

## Documentação

- [ARCHITECTURE.md](./ARCHITECTURE.md) — decisões e estrutura de módulos
- [DATABASE.md](./DATABASE.md) — modelo de dados, migrations, backup
- [API.md](./API.md) — contratos das rotas REST
- [DEPLOY.md](./DEPLOY.md) — implantação no Render
- [SECURITY.md](./SECURITY.md) — segurança e LGPD
- [CHANGELOG.md](./CHANGELOG.md) — histórico de decisões relevantes

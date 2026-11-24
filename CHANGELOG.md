# Changelog — VIXT Central

## [0.1.0] — Fase 1 (Fundação) + estrutura das Fases 2 e 3

### Adicionado

- Projeto Next.js 16 / React 19 / TypeScript / Tailwind 4.
- Schema Prisma completo (19 tabelas) e migration inicial versionada.
- Módulos de domínio: auth, applications, categories, distributions, versions,
  analytics, content, banners, stats, settings.
- Design system VIXT (tokens azul elétrico, componentes de UI, animações,
  responsividade).
- Portal público: home, catálogo com filtros/paginação, página individual,
  categorias, contato, sitemap, robots, 404.
- Painel administrativo: login, dashboard com gráficos, CRUD de aplicativos,
  categorias, banners e conteúdo.
- APIs REST públicas e administrativas com envelope consistente.
- Seed idempotente com os 5 aplicativos VIXT (publicados apenas com link real).
- 15 testes automatizados (Vitest) cobrindo validação, segurança e regras.
- Documentação técnica completa.

### Decisões

- **Prisma fixado em 6.19.3**: `prisma@latest` é 8.0.0-rc, uma plataforma
  diferente (PSL substituído por "contract"). A linha 7 trazia a mesma falha
  transitiva de `effect` do audit. Com `overrides` para `effect@3.22.5` e
  `deepmerge-ts@8.0.2`, a combinação atual tem **0 vulnerabilidades** e CLI
  funcional.
- **`cacheComponents: false`**: o template do Next 16 vem com o flag ativado,
  mas ele rejeita `dynamic = "force-dynamic"`. Como todas as páginas leem
  Prisma/cookies, optamos por renderização dinâmica explícita. Reavaliar ao
  introduzir `use cache` + `cacheTag`.
- **`proxy.ts` em vez de `middleware.ts`**: convenção do Next 16.
- **Login fora do layout protegido**: `app/admin/login` ficou fora do grupo
  `(admin)` para não redirecionar a si mesmo.

### Validado localmente

- `npm run build` ✅
- `npm test` — 15/15 ✅
- `npx tsc --noEmit` ✅
- `npm audit` — 0 vulnerabilidades ✅
- PostgreSQL local: migration aplicada, seed executado, login administrativo,
  catálogo, dashboard, redirecionamento de download e auditoria de eventos ✅

### Pendências

- `DATABASE_URL`/`DIRECT_DATABASE_URL` de produção (Neon) — não fornecidas.
- URLs reais dos aplicativos existentes (`LINK_*_WEB`) — não fornecidas.
- Deploy em produção — **não autorizado, não executado**.
- Upload de imagens (S3/R2), Sentry, Redis para rate limit multi-instância.
- Testes E2E (Playwright) e testes de segurança automatizados (Fase 5).

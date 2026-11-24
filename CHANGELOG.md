# Changelog — VIXT Central

## [0.2.2] — APK de demonstração Android (VIXT Barbearia)

- Segundo APK real gerado via Capacitor: `vixt-barbearia-1.0.0-demo.apk`
  (4.339.895 B, SHA-256 `190420b8…71bba`, pacote `br.com.vixt.barbearia.demo`).
- Label/appId/namespace ajustados para Barbearia antes do build.
- Rota de download atualizada com o novo arquivo na allowlist.
- "Android — Em breve" substituído por "Baixar para Android" na Barbearia.
- Download validado (HTTP 200, SHA-256 idêntico) e registro de evento OK.

---

## [0.2.1] — APK de demonstração Android (VIXT Oficina)

### Adicionado

- APK real gerado com Capacitor 7 + Android SDK 35 + JDK 21:
  `mobile/artifacts/vixt-oficina-1.0.0-demo.apk` (não versionado).
- Rota `GET /api/public/downloads/[file]` (allowlist) para servir o APK local.
- Distribuição `ANDROID/AVAILABLE` cadastrada com URL + SHA-256 + tamanho reais.
- Botão "Baixar para Android" substituiu "Em breve" na página da Oficina.
- Scripts `npm run apk:demo` / `npm run sha` em `mobile/package.json`.

### Decisões

- APK **debug assinado**, finalidade demonstração — não é build de produção,
  não usa keystore definitivo e não foi publicado na Play Store.
- URL `http://10.0.2.2:3000` (host do emulador) + `usesCleartextTraffic` apenas
  na demonstração; produção exigirá HTTPS.
- O `.apk` e o projeto Gradle gerado ficam fora do Git via `mobile/.gitignore`.

### Validado

- `apksigner verify` (v1/v2) ✅ · `aapt dump badging` ✅
- Download HTTP 200 com SHA-256 idêntico ao original ✅
- Redirect registra evento `DOWNLOAD` ✅

---

## [0.2.0] — Distribuição Desktop (Windows) e preparação Android

### Adicionado

- Migration incremental `20261124000000_distribution_platforms` com
  `platform`, `availability`, `fileName`, `fileSizeBytes`, `checksumSha256`,
  `notes` e índice composto em `distributions`.
- `DistributionPanel` na página do aplicativo: grupos **Web**, **Desktop**,
  **Mobile** e **Próximas versões** ("Em breve" sem link clicável).
- Wrapper Electron em `desktop/`: janela independente, ícone próprio por app,
  origens permitidas, auto-update estruturado (desativado até release real).
- Ícones `.ico` reais gerados por `desktop/build/make-icons.py`.
- Workflow `.github/workflows/desktop-build.yml` (manual, `windows-latest`)
  que valida a URL antes de compilar e faz upload do artefato.
- Preparação Capacitor em `mobile/` — sem build, sem Play Store.
- `prisma/seed-distributions.ts`: cadastra apenas binários com URL http(s) e
  SHA-256 válido; nunca cria links fictícios.
- `DISTRIBUTION.md` com processo completo de build e publicação.

### Decisões

- **Electron em vez de Tauri**: ambiente sem Rust/cross-compile Windows e apps
  são web (Next.js). O wrapper aponta para a URL existente — nenhum aplicativo
  ou banco externo foi modificado.
- **Nenhum `.exe` gerado nesta entrega**: as URLs reais não foram fornecidas;
  o workflow falha de propósito enquanto o config contém `SUBSTITUA`.
- **"Android — Em breve" é informativo**: `availability=COMING_SOON` nunca
  produz URL clicável.

### Validado

- Migration aplicada em PostgreSQL local ✅
- Seed de distribuições: sem env → nenhum link; com `ANNOUNCE_ANDROID_COMING_SOON`
  → apenas "Em breve" ✅
- API `/api/public/applications/oficina` retorna `distributionGroups` ✅
- Página renderiza Web + Android "Em breve" ✅
- typecheck, 15 testes, build e lint ✅

---

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

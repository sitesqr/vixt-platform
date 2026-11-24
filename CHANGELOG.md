# Changelog — VIXT Central

## [0.3.4] — Invalidação do cache PWA no celular

- `sw.js` passou a `vixt-v2` e remove caches antigos (`vixt-v1`) no `activate`.
- Páginas usam network-first (sempre buscam versão nova; cache só offline).
- `PwaRegister` força `registration.update()` e recarrega uma vez quando há
  service worker novo — elimina a tela antiga com link de APK no celular.
- Confirmado: apenas a branch `master` existe (sem `main`).

---

## [0.3.3] — Instalação PWA real

- Botão PWA deixou de ser um link e passou a ser um `<button>` que captura
  `beforeinstallprompt` e chama `prompt()` no clique (instala de fato no Chrome).
- Fallback com instruções para iOS e navegadores sem suporte.
- Estado "Aplicativo instalado" após `appinstalled`.
- Validado em produção: HTML contém `<button type="button">`.

---

## [0.3.2] — PWA no lugar de APK (remove aviso do Android)

- Distribuições `ANDROID/APK` removidas do catálogo de produção.
- VIXT Central passou a ser PWA: `manifest.webmanifest`, `sw.js`,
  ícones 192/512, registro via `PwaRegister` e metadados no layout.
- Cadastrada distribuição `PWA` ("Instalar aplicativo (PWA)") para Oficina e
  Barbearia, agrupada na seção Web.
- Nenhum aviso do Google Play Protect: instalação ocorre pelo navegador.

---

## [0.3.1] — APKs release assinados (correção do aviso do Android)

- Keystore de release próprio VIXT (`CN=VIXT`), configurado no Gradle via
  `keystore.properties` (não versionado).
- APKs de Oficina e Barbearia recompilados em **release** (não debug):
  - Oficina: 3.151.864 B · `6f207ef0…84b8df0`
  - Barbearia: 3.151.844 B · `89707699…349163`
- `apksigner verify` confirmou assinatura v1/v2 com certificado VIXT.
- Banco de produção atualizado com os novos SHA-256/tamanhos.
- Documentado que o aviso "arquivo pode ser nocivo" é o Play Protect padrão
  para sideload, não um defeito do arquivo.

---

## [0.3.0] — Deploy em produção (Render free + Neon)

- Web Service `vixt-central` no Render (plano free, região Oregon).
- Banco PostgreSQL independente no Neon (`vixt-central`, região aws-us-east-1),
  com as 2 migrations aplicadas.
- Seed de produção: admin, 2 aplicativos publicados com URLs reais dos sistemas
  existentes e 2 distribuições Android apontando para o próprio Render.
- APKs de demonstração passaram a ser versionados para que os downloads
  funcionem no deploy.
- Seed corrigido para nunca criar links `localhost` em produção.

**Credenciais de produção não são versionadas** e estão no painel do Render.

---

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

# Changelog — VIXT Central

## [0.4.0] — Remoção completa de downloads e PWA

A pedido, todos os recursos de distribuição de arquivos foram removidos.
A plataforma passa a oferecer **apenas acesso à versão web** dos aplicativos.

### Removido

- Diretórios `desktop/`, `mobile/`, `pwa-apk/` e `twa/` (Electron, Capacitor,
  APKs, keystore, projetos Android).
- Arquivos PWA: `manifest.webmanifest`, `sw.js`, ícones 192/512 e maskable.
- Componentes `pwa-install.tsx`, `pwa-register.tsx`.
- Rotas `/api/public/downloads`, `/api/public/track`.
- Migration `20261125000000_remove_downloads`: remove colunas
  `platform`, `availability`, `fileName`, `fileSizeBytes`, `checksumSha256`,
  `notes`, `trackDownload`, `confirmed` e `downloads`; reduz os enums
  `DistributionType` a `WEB|OTHER` e `AnalyticsEventType` a `VIEW|CLICK`.
- Documentação `DISTRIBUTION.md` e menções a download em todos os `.md`.

### Mantido

- Catálogo, páginas individuais, pesquisa, filtros e ordenação.
- **Botões de acesso** na página do aplicativo (via `/api/public/redirect/:id`).
- Versões, distribuições WEB, conteúdo, banners, admin e estatísticas.
- Estatísticas de visualização e clique.

---

## [0.3.0] — Deploy em produção (Render free + Neon)

- Web Service `vixt-central` no Render (free, Oregon).
- Banco Neon independente, com migrations aplicadas.
- Seed: admin, aplicativos com URLs reais e categorias.
- Node fixado em 22 via `.nvmrc`.

---

## [0.2.0] — Catálogo, distribuição e administração

- Design system VIXT, portal, catálogo dinâmico e páginas individuais.
- Sistema de distribuição com redirecionamento seguro e estatísticas.
- Painel administrativo com autenticação Argon2id + JWT e auditoria.
- SEO, sitemap, robots e testes automatizados.

---

## [0.1.0] — Fundação

- Next.js 16 + TypeScript + Tailwind 4 + Prisma 6 + PostgreSQL.
- Arquitetura modular e identidade visual.

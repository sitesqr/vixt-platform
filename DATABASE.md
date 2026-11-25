# Banco de dados — VIXT Central

PostgreSQL independente. **Nenhum banco dos aplicativos existentes é utilizado.**

## Tabelas

| Tabela | Finalidade |
| --- | --- |
| `admins`, `admin_sessions`, `admin_roles`, `permissions`, `role_permissions` | Autenticação e RBAC administrativo |
| `audit_logs` | Auditoria de ações (sem IP bruto) |
| `applications` | Catálogo (slug único, status, publicação, destaque, ownership, `pwaUrl`) |
| `categories` | Categorias dinâmicas |
| `features`, `app_images` | Funcionalidades e galeria por aplicativo |
| `publishers` | Reservado para marketplace futuro (não ativo) |
| `app_versions` | Histórico de versões (semver, changelog, status) |
| `distributions` | Links de acesso (WEB/OTHER) |
| `site_contents`, `faqs`, `banners`, `settings` | Conteúdo administrável |
| `analytics_events`, `daily_stats` | Estatísticas de VIEW/CLICK sem PII |

## Relacionamentos principais

- `Application` → `Category` (N:1, `SetNull`)
- `Application` → `Feature`, `AppImage`, `AppVersion` (1:N, `Cascade`)
- `AppVersion` → `Distribution` (1:N, `SetNull`)
- `AnalyticsEvent` → `Application` / `Distribution` (`Cascade` / `SetNull`)
- `DailyStat` → `Application` (`Cascade`), `@@unique([date, applicationId])`

## Constraints e índices

- Slugs únicos em `applications`, `categories`, `publishers`.
- `@@unique([applicationId, version])` em `app_versions`.
- `@@unique([date, applicationId])` em `daily_stats`.
- Índices em `published+status`, `categoryId`, `featured`, `createdAt`,
  `applicationId+type+createdAt` e `expiresAt` (sessões).

## Migrations

```bash
npm run db:migrate          # produção (migrate deploy)
npm run db:dev              # desenvolvimento (migrate dev)
```

Migrations versionadas em `prisma/migrations/`. A inicial foi gerada via
`prisma migrate diff --from-empty`. A última remove campos de distribuição
que não fazem parte desta versão (sem downloads).

## Seed

`prisma/seed.ts` é idempotente (usa `upsert`). Cria:

- papéis e permissões;
- primeiro admin **somente** se `ADMIN_EMAIL` e `ADMIN_PASSWORD` existirem;
- categorias, aplicativos, FAQs e textos padrão.

Aplicativos só são publicados se `LINK_<APP>_WEB` contiver uma URL http(s) real
e não-local — nunca links inventados. `DEFERRED_SLUGS` mantém adiados
Borracharia, Lava Rápido e Salão.

## Backup (Neon)

- Point-in-Time Recovery do plano Neon.
- Backups lógicos periódicos:

```bash
pg_dump "$DIRECT_DATABASE_URL" -Fc -f "backup-vixt-$(date +%F).dump"
```

- `DATABASE_URL` usa pooler; `DIRECT_DATABASE_URL` é usada por migrations e
  backups.

## Armazenamento de arquivos

Nenhum arquivo binário é armazenado ou servido. Apenas URLs de imagem.

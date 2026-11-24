# Banco de dados — VIXT Central

PostgreSQL independente. **Nenhum banco dos aplicativos existentes é utilizado.**

## Visão geral das tabelas

| Tabela | Finalidade |
| --- | --- |
| `admins`, `admin_sessions`, `admin_roles`, `permissions`, `role_permissions` | Autenticação e RBAC administrativo |
| `audit_logs` | Auditoria de ações (sem IP bruto) |
| `applications` | Catálogo (slug único, status, publicação, destaque, ownership) |
| `categories` | Categorias dinâmicas |
| `features`, `app_images` | Funcionalidades e galeria por aplicativo |
| `publishers` | Reservado para marketplace futuro (não ativo) |
| `app_versions` | Histórico de versões (semver, changelog, status) |
| `distributions` | Links por plataforma (WEB/PLAY_STORE/APK/PWA/DESKTOP/OTHER) |
| `site_contents`, `faqs`, `banners`, `settings` | Conteúdo administrável |
| `analytics_events`, `daily_stats` | Estatísticas sem PII |

## Relacionamentos Principais

- `Application` → `Category` (N:1, `SetNull`)
- `Application` → `Feature`, `AppImage`, `AppVersion` (1:N, `Cascade`)
- `AppVersion` → `Distribution` (1:N, `SetNull`)
- `AnalyticsEvent` → `Application` / `Distribution` (`Cascade` / `SetNull`)
- `DailyStat` → `Application` (`Cascade`), `@@unique([date, applicationId])`

## Constraints e índices

- Slugs únicos em `applications`, `categories`, `publishers`.
- `@@unique([applicationId, version])` em `app_versions`.
- `@@unique([date, applicationId])` em `daily_stats` (agregação diária).
- Índices em `published+status`, `categoryId`, `featured`, `createdAt`,
  `applicationId+type+createdAt` e `expiresAt` (sessões).

## Migrations

```bash
npm run db:migrate          # produção (migrate deploy)
npm run db:dev              # desenvolvimento (migrate dev)
```

A migration inicial está em
`prisma/migrations/20261123000000_init/migration.sql` (gerada via
`prisma migrate diff --from-empty`, sem necessidade de banco local).

## Seed

`prisma/seed.ts` é idempotente (usa `upsert`). Cria:

- papéis/permissões;
- primeiro admin **somente** se `ADMIN_EMAIL` e `ADMIN_PASSWORD` estiverem
  definidos (senha nunca hardcoded);
- 5 categorias, 5 aplicativos, FAQs e textos padrão.

Os aplicativos só são publicados se a variável `LINK_<APP>_WEB` correspondente
contiver uma URL real. Sem link, ficam em `DEVELOPMENT` e **não aparecem** no
catálogo — evitando botões falsos.

## Estratégia de backup (Neon)

- **Point-in-Time Recovery (PITR)** do plano Neon (quando habilitado).
- Backups lógicos periódicos com `pg_dump` agendado fora do horário de pico:

```bash
pg_dump "$DIRECT_DATABASE_URL" -Fc -f "backup-vixt-$(date +%F).dump"
```

- Restauração de teste trimestral em banco separado antes de qualquer uso real.
- `DATABASE_URL` usa pooler (pgbouncer); `DIRECT_DATABASE_URL` é usada apenas
  por migrations e backups.

## Armazenamento de arquivos

Fase 1 armazena apenas URLs (`iconUrl`, `imageUrl`) — nenhum binário no banco.
Fase futura: S3/R2 com chaves por aplicativo e CDN na frente.

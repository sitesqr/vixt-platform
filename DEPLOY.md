# Deploy — VIXT Central

## Ambiente de produção

| Item | Valor |
|---|---|
| URL pública | https://vixt-central.onrender.com |
| Render | Web Service `vixt-central`, plano **Free**, região Oregon |
| Neon | Projeto `vixt-central`, região aws-us-east-1 |
| Repositório | https://github.com/sitesqr/vixt-platform |
| Branch | `master` (auto-deploy) |
| Node | 22.23.4 (via `.nvmrc`) |

## Variáveis de ambiente

Copiar de `.env.example`. Principais:

| Variável | Observação |
| --- | --- |
| `DATABASE_URL` | Neon com pooler (`pgbouncer=true`) |
| `DIRECT_DATABASE_URL` | Neon direta (migrations) |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `ANALYTICS_SALT` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://vixt-central.onrender.com` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Usados no seed |
| `LINK_*_WEB` | URLs reais dos aplicativos existentes |

Nenhuma credencial é versionada.

## Build & Start

```
Build: npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
Start: npm run start
```

## Domínio

1. Adicionar `vixt.com.br` no Render.
2. Configurar DNS e certificado TLS.
3. Ajustar `NEXT_PUBLIC_SITE_URL` e redeploy.

## Checklist pós-deploy

- [ ] `GET /` e `/aplicativos` retornam 200.
- [ ] `/admin` redireciona para `/admin/login`.
- [ ] Login administrativo funciona.
- [ ] `GET /sitemap.xml` e `/robots.txt` acessíveis.
- [ ] `npm audit` sem vulnerabilidades.

## Rollback

Render mantém deploys anteriores. Migrations são forward-only; reversões de
schema exigem nova migration.

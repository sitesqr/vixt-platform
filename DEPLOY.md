# Deploy — VIXT Central (Render)

> ✅ **Deploy executado em 24/11/2026** (mediante autorização): Render free +
> Neon. URL pública: **https://vixt-central.onrender.com**.
> Credenciais ficam apenas no painel do Render / Neon — nunca no repositório.

## Pré-requisitos

1. Conta no Neon com banco `vixt_central` (region próxima ao Render).
2. Conta no Render com Web Service (Node.js).
3. Repositório Git (GitHub) com o projeto.

## Variáveis de ambiente no Render

Copiar de `.env.example` e preencher **todas**:

| Variável | Observação |
| --- | --- |
| `DATABASE_URL` | String do Neon **com pooler** (`-pooler...`), `sslmode=require&pgbouncer=true` |
| `DIRECT_DATABASE_URL` | String direta (sem pooler) — usada por migrations |
| `JWT_SECRET` | `openssl rand -base64 48` |
| `ANALYTICS_SALT` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://vixt.com.br` |
| `NODE_ENV` | `production` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Usados apenas na primeira execução do seed |
| `LINK_*_WEB` | URLs reais dos aplicativos existentes (se já publicados) |

## Build & Start no Render

```
Build Command:   npm install && npx prisma generate && npm run db:migrate && npm run build
Start Command:   npm run start
```

> `prisma migrate deploy` é idempotente. Se preferir separar, rode migrations
> manualmente via Shell do Render antes do primeiro deploy.

## Domínio e DNS

1. Adicionar domínio customizado `vixt.com.br` no Render.
2. Configurar DNS (CNAME/A) conforme instruído pelo Render.
3. Certificado TLS automático.
4. Ajustar `NEXT_PUBLIC_SITE_URL` e redeploy.

## Pós-deploy (checklist)

- [ ] `GET /` retorna 200 e exibe o catálogo.
- [ ] `GET /admin` redireciona para `/admin/login`.
- [ ] Login com o admin criado no seed funciona.
- [ ] `GET /api/admin/stats` com cookie retorna 200.
- [ ] `GET /sitemap.xml` e `/robots.txt` acessíveis.
- [ ] Links de download apontam para destinos reais.
- [ ] `npm audit` sem vulnerabilidades.
- [ ] Monitoramento de erros configurado (Sentry — variável opcional).

## Rollback

Render mantém deploys anteriores. Em caso de falha, usar "Rollback to previous
build". Migrations são forward-only; reversões de schema exigem nova migration.

# Deploy — VIXT Central

> ✅ **Deploy executado em 24/11/2026** (mediante autorização).

## Ambiente de produção

| Item | Valor |
|---|---|
| **URL pública** | **https://vixt-central.onrender.com** |
| Render | Web Service `vixt-central`, plano **Free**, região Oregon |
| Neon | Projeto `vixt-central` (`winter-pond-31901958`), região aws-us-east-1 |
| Repositório | https://github.com/sitesqr/vixt-platform |
| Branch | `master` (auto-deploy) |
| Node | 22.23.4 (via `.nvmrc`) |

### Build/Start

```
Build: npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
Start: npm run start
```

### Credenciais

As variáveis (DATABASE_URL, DIRECT_DATABASE_URL, JWT_SECRET, ANALYTICS_SALT,
ADMIN_EMAIL/PASSWORD) estão **apenas no painel do Render** e no Neon — nunca
no repositório. O primeiro administrativo é `admin@vixt.com.br` (senha gerada
aleatoriamente e entregue ao contratante fora do Git).

## Estado validado em produção

- Portal, catálogo, páginas individuais e login: HTTP 200.
- Catálogo: 2 aplicativos publicados (Oficina e Barbearia) com links WEB reais
  apontando para os sistemas já existentes.
- Downloads Android: HTTP 200, SHA-256 idêntico aos artefatos gerados.
- Redirect WEB: 302 para o aplicativo real.
- Dashboard admin: indicadores e auditoria funcionando.
- Migrações aplicadas no Neon (2 migrations).

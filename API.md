# API — VIXT Central

Base: `/api`. Envelope:

```json
{ "ok": true, "data": ... }
{ "ok": false, "error": { "code": "...", "message": "...", "details": ... } }
```

Códigos: `BAD_REQUEST` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403),
`NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429),
`DATABASE_UNAVAILABLE` (503), `INTERNAL` (500).

---

## Público (sem autenticação)

### `GET /api/public/applications`

Query: `q`, `category`, `sort` (`featured|name|popular|recent`), `page`,
`pageSize` (≤48). Retorna `{ items, total, page, pageSize, totalPages }`.
Apenas apps com `published=true`, `status=AVAILABLE`, `ownership=VIXT`.

### `GET /api/public/applications/:slug`

Detalhe completo: descrição, funcionalidades, imagens, versões, links de acesso,
requisitos e suporte. Registra um evento `VIEW`.

### `GET /api/public/categories`

Categorias ativas com contagem de aplicativos publicados.

### `GET /api/public/redirect/:id`

Redireciona (302) para o link de acesso cadastrado no banco. **Nunca aceita
destino da requisição** (previne open redirect). Registra evento `CLICK`.

---

## Admin (autenticação obrigatória)

Todas as rotas `/api/admin/**` chamam `requireAdmin()` no servidor (401 sem
sessão válida).

### `POST /api/admin/auth/login` · `POST /api/admin/auth/logout` · `GET /api/admin/auth/me`

Login define cookie HttpOnly `vixt_admin_session` (rate limit 5/15min por
e-mail). Logout revoga a sessão no banco.

### `GET/POST /api/admin/applications`

Lista completa / cria. POST exige `slug`, `name`, `tagline`, `description`.

### `PATCH/DELETE /api/admin/applications/:id`

Atualiza campos permitidos / exclui. Grava `audit_log`.

### `POST /api/admin/applications/:id/publish`

Publica somente se `status=AVAILABLE` e houver link http(s) ativo.

### `GET/POST /api/admin/categories` · `PATCH/DELETE /api/admin/categories/:id`

CRUD de categorias. Exclusão com apps relacionados usa `SetNull`.

### `GET/POST /api/admin/banners` · `GET /api/admin/content` · `PUT /api/admin/content/:key`

CRUD de banners e edição de conteúdo institucional.

### `GET /api/admin/stats?days=30`

Dashboard: totais, top apps, timeline diária, atividade recente e publicações.

> As regras de negócio de versões e distribuições ficam em
> `modules/versions` e `modules/distributions`.

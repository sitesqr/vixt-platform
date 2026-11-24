# API — VIXT Central

Base: `/api`. Todas as respostas usam o envelope:

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

Query: `q`, `category` (slug), `sort` (`featured|name|popular|recent`),
`page` (≥1), `pageSize` (≤48).

Retorna `{ items, total, page, pageSize, totalPages }`. `items` contém apenas
apps com `published=true`, `status=AVAILABLE` e `ownership=VIXT`.

### `GET /api/public/applications/:slug`

Detalhe completo: descrição, funcionalidades, imagens, versões, distribuições
com links válidos, requisitos e suporte. Registra um evento `VIEW`.

### `GET /api/public/categories`

Categorias ativas com contagem de aplicativos publicados.

### `GET /api/public/redirect/:id`

Redireciona (302) para a URL cadastrada no banco. **Nunca aceita URL externa
como parâmetro** — previne open redirect. Registra `CLICK` ou `DOWNLOAD`
conforme `trackDownload` do link, sempre com `confirmed: false`.

### `POST /api/public/track`

Body: `{ "distributionId": "<uuid>", "kind": "click" | "download" }`.
Valida o link no banco; rate limit de 60/min por sessão IP-hash.

---

## Admin (autenticação obrigatória)

Todas as rotas `/api/admin/**` chamam `requireAdmin()` no servidor e retornam
401 se a sessão JWT não for válida **ou** se não existir no banco.

### `POST /api/admin/auth/login`

Body: `{ email, password }`. Define cookie HttpOnly `vixt_admin_session`.
Rate limit: 5 tentativas / 15 min por e-mail.

### `POST /api/admin/auth/logout`

Revoga a sessão no banco e remove o cookie.

### `GET /api/admin/auth/me`

Retorna `{ authenticated, admin }`.

### `GET/POST /api/admin/applications`

Lista completa (incluindo não publicados) / cria. POST exige `slug`, `name`,
`tagline`, `description`.

### `PATCH/DELETE /api/admin/applications/:id`

Atualiza campos permitidos / exclui. Grava `audit_log`.

### `POST /api/admin/applications/:id/publish`

Publica somente se `status=AVAILABLE` **e** houver link ativo com URL http(s).
Caso contrário retorna 400 com o motivo.

### `GET/POST /api/admin/categories` · `PATCH/DELETE /api/admin/categories/:id`

CRUD de categorias. Exclusão com apps relacionados usa `SetNull`.

### `GET /api/admin/banners` · `POST /api/admin/banners`

CRUD de banners (edição via PATCH em `/api/admin/banners/:id` — ver código).

### `GET /api/admin/content` · `PUT /api/admin/content/:key`

Lista textos e FAQs / salva um texto institucional (marca `isDefault=false`).

### `GET /api/admin/stats?days=30`

Dashboard: totais, top apps, timeline diária, atividade recente e publicações.

> Rotas de versões e distribuições são implementadas nos módulos
> (`modules/versions`, `modules/distributions`) e podem ser expostas via
> rotas admin adicionais conforme necessidade; o catálogo público já consome
> esses dados através de `applicationsService.getBySlug`.

# Segurança e LGPD — VIXT Central

## Autenticação administrativa

- Hash de senha com **Argon2id** (64 MiB, t=3, p=4).
- JWT HS256 assinado com `JWT_SECRET` (mín. 32 caracteres), em cookie
  **HttpOnly + Secure (produção) + SameSite=Lax**.
- Sessão persistida no banco (`admin_sessions`) com hash SHA-256 do token —
  logout revoga de fato.
- Rate limit de login: 5 tentativas / 15 min por e-mail.
- `/admin/**` protegido pelo `proxy.ts` **e** por `getSession()` no layout.
- `/api/admin/**` protegido por `requireAdmin()` no backend (401 sem sessão).
- Erro de login não revela se o e-mail existe.

## Validação e injeção

- Prisma com queries parametrizadas — proteção contra SQL Injection.
- Entradas validadas com Zod (slugs, URLs http(s), senha, UUIDs).
- URLs de acesso vêm somente do banco; `/api/public/redirect/:id` não aceita
  destino do cliente (previne open redirect).
- React escapa conteúdo por padrão — proteção contra XSS. Nenhum
  `dangerouslySetInnerHTML` com conteúdo de usuário.
- CSRF mitigado por SameSite=Lax + cookies HttpOnly.

## Rate limiting e abuso

- Login: 5/15min por e-mail.
- Limiter em memória por instância — trocar por Redis se escalar.

## Auditoria

`audit_logs` registra login (sucesso/falha), logout e alterações em
aplicativos, com `ipHash` (não IP bruto).

## LGPD

- Visitantes não fornecem dados pessoais: sem cadastro e sem login.
- `AnalyticsEvent.sessionHash` é SHA-256 com salt; `referrer` é truncado; IP
  bruto nunca é persistido.
- Privacidade e termos ficam em `/contato`, administráveis pelo painel.
- Política de retenção sugerida: 12 meses para `analytics_events`.

## Segredos

- `.env` não versionado (`.gitignore`); `.env.example` contém só placeholders.
- Erros do Prisma são traduzidos para mensagens genéricas.

## Auditoria de dependências

`npm audit`: **0 vulnerabilidades**, com `overrides` para `effect@3.22.5` e
`deepmerge-ts@8.0.2` (transitivas do CLI do Prisma).

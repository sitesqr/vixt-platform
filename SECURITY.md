# Segurança e LGPD — VIXT Central

## Autenticação administrativa

- Hash de senha com **Argon2id** (64 MiB, t=3, p=4), nunca senha em texto.
- JWT HS256 assinado com `JWT_SECRET` (mín. 32 caracteres), em cookie
  **HttpOnly + Secure (produção) + SameSite=Lax**.
- Sessão persistida no banco (`admin_sessions`) com hash SHA-256 do token —
  logout revoga de fato.
- Rate limit de login: 5 tentativas / 15 min por e-mail.
- `/admin/**` protegido pelo `proxy.ts` **e** por `getSession()` no layout.
- `/api/admin/**` protegido por `requireAdmin()` no backend (401 sem sessão).
- Nenhuma mensagem de erro revela se o e-mail existe ("E-mail ou senha incorretos").

## Validação e injeção

- Prisma com queries parametrizadas — proteção contra SQL Injection.
- Todas as entradas validadas com Zod (slugs, URLs http(s), senha, UUIDs).
- URLs de download vêm somente do banco; `/api/public/redirect/:id` não aceita
  destino do cliente (previne open redirect).
- React escapa conteúdo por padrão — proteção contra XSS. Nenhum
  `dangerouslySetInnerHTML` com conteúdo de usuário (apenas JSON-LD interno).
- CSRF mitigado por SameSite=Lax + cookies HttpOnly; endpoints que alteram
  estado exigem sessão e (futuro) token adicional se necessário.

## Rate limiting e abuso

- Login: 5/15min por e-mail.
- Eventos de analytics: 60/min por sessão hash.
- Limiter em memória por instância — se o Render escalar para múltiplas
  instâncias, substituir por Redis (fronteira isolada em `lib/rate-limit.ts`).

## Auditoria

`audit_logs` registra login (sucesso/falha), logout, criação/edição/exclusão/
publicação de aplicativos, com `ipHash` (não IP bruto).

## LGPD

- Visitantes não fornecem dados pessoais: sem cadastro, sem login, sem e-mail
  obrigatório no download.
- `AnalyticsEvent.sessionHash` é SHA-256 com salt; `referrer` é truncado; IP
  bruto nunca é persistido.
- Textos de privacidade e termos ficam na página `/contato`, administráveis
  pelo painel.
- Política de retenção: definir prazo de limpeza de `analytics_events` em
  produção (sugestão: 12 meses) via job agendado.

## Segredos

- `.env` não versionado (`.gitignore`).
- `.env.example` contém apenas placeholders.
- Nenhuma credencial aparece em logs; erros do Prisma são traduzidos para
  mensagens genéricas em `lib/api-response.ts`.

## Auditoria de dependências

`npm audit` executado na Fase 1: **0 vulnerabilidades**, com `overrides` em
`effect@3.22.5` e `deepmerge-ts@8.0.2` (transitivas do CLI do Prisma).

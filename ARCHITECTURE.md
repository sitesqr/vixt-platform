# Arquitetura — VIXT Central

## Princípios

1. **Monolito modular.** Um deploy, módulos com fronteiras claras. Sem
   microsserviços nesta fase.
2. **Catálogo dinâmico.** Nenhum aplicativo é definido em código. Seed apenas
   semeia dados iniciais reais; edições feitas no admin aparecem no portal.
3. **Backend é a fonte da verdade.** Toda proteção visual tem equivalente no
   servidor. Todo link de download vem do banco, nunca do cliente.
4. **Dados públicos não exigem identidade.** Navegação e download anônimos.
5. **Preparar sem ativar.** Marketplace é representado no modelo de dados
   (`Ownership`, `Publisher`) mas sem rotas ou UI habilitadas.

## Estrutura de pastas

```
app/
  (public)/                 # Portal: /, /aplicativos, /aplicativos/[slug],
                            # /categorias, /contato
  (admin)/admin/            # Painel protegido (layout com getSession)
  admin/login/              # Login FORA do layout protegido
  api/public/               # Catálogo, categorias, redirect, track (somente leitura)
  api/admin/                # CRUD protegido (requireAdmin)
  sitemap.ts, robots.ts, not-found.tsx
components/
  ui/                       # Design system: Button, Card, Badge, Logo, Input
  layout/                   # Header, Footer
  apps/                     # AppCard
  admin/                    # AdminShell, LoginForm, managers, gráficos
lib/
  prisma.ts, api-response.ts, validation.ts, password.ts, jwt.ts,
  rate-limit.ts, analytics.ts, safe-data.ts, admin-guard.ts, utils.ts
modules/
  auth/ applications/ categories/ distributions/ versions/
  analytics/ content/ banners/ stats/ settings/
  # cada módulo: types.ts + repository.ts + service.ts + index.ts
prisma/
  schema.prisma, migrations/, seed.ts
tests/unit/
proxy.ts                    # Proteção de primeira linha (Next 16 substitui middleware)
```

## Fluxo de uma requisição

### Público

```
Página/API → service → repository → Prisma → PostgreSQL
                         ↓
                    analytics (fire-and-forget, nunca bloqueia)
```

`safePublicQuery` envolve consultas em páginas: se o banco não estiver
configurado ou falhar, a página renderiza um estado vazio honesto (nunca dados
fictícios) e as APIs retornam 503 com código `DATABASE_UNAVAILABLE`.

### Admin

```
proxy.ts (cookie presente?)
   ↓
layout /admin (getSession: JWT + sessão no banco)
   ↓
api/admin/** (requireAdmin → 401 se inválido)
   ↓
service → repository → auditLog
```

## Decisões técnicas relevantes

| Decisão | Motivo |
| --- | --- |
| Next.js 16 com `cacheComponents: false` | Rotas dependem de Prisma e cookies; renderização dinâmica explícita é previsível. Reavaliar com camada de cache isolada. Ver CHANGELOG. |
| `proxy.ts` em vez de `middleware.ts` | Convenção do Next 16 (middleware deprecado). |
| Prisma 6.19.3 fixado + overrides `effect@3.22.5` / `deepmerge-ts@8.0.2` | Última combinação com 0 vulnerabilidades no `npm audit` e CLI funcional. Prisma 8 é uma plataforma diferente (PSL → contract) e foi evitado. |
| Argon2id (64 MiB, t=3, p=4) | Resistente a GPU; parâmetros alinhados à OWASP. |
| JWT em cookie HttpOnly + sessão persistida | Revogação real (DELETE da sessão), CSRF mitigado por SameSite=Lax. |
| Hash de IP com salt para analytics | Atende LGPD: dado bruto nunca persistido. |
| `DOWNLOAD` com `confirmed: false` | Clique ≠ instalação. Nunca afirmamos instalação concluída. |
| `DailyStat.applicationId` obrigatório | Simplifica `upsert` e garante integridade das agregações. |
| Sem `use cache` | Dados do catálogo mudam pelo admin; cache de página exigiria invalidação por tag ainda não implementada. |

## Expansão futura (preparada, não ativada)

- `Ownership.VIXT | THIRD_PARTY` e `Publisher.approved` já existem no schema.
- `publicWhere` filtra `ownership: VIXT` — quando o marketplace for ativado,
  basta adicionar uma política de publicação e rotas de submissão/aprovação.
- Nenhuma rota pública de desenvolvedor, comissão ou cobrança existe hoje.

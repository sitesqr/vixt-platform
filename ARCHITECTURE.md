# Arquitetura — VIXT Central

## Princípios

1. **Monolito modular.** Um deploy, módulos com fronteiras claras
   (`types.ts` → `repository.ts` → `service.ts`). Sem microsserviços.
2. **Catálogo dinâmico.** Nenhum aplicativo é definido em código. O seed apenas
   semeia dados iniciais reais; edições no admin aparecem no portal.
3. **Backend é a fonte da verdade.** Toda proteção visual tem equivalente no
   servidor. Todo link de acesso vem do banco, nunca do cliente.
4. **Dados públicos não exigem identidade.** Navegação e acesso anônimos.
5. **Preparar sem ativar.** Marketplace é representado no modelo de dados
   (`Ownership`, `Publisher`) mas sem rotas ou UI habilitadas.

## Estrutura de pastas

```
app/
  (public)/                 # /, /aplicativos, /aplicativos/[slug],
                            # /categorias, /contato
  (admin)/admin/            # Painel protegido (layout com getSession)
  admin/login/              # Login FORA do layout protegido
  api/public/               # applications, [slug], categories, redirect
  api/admin/                # CRUD protegido (requireAdmin)
  sitemap.ts, robots.ts, not-found.tsx
components/
  ui/                       # Design system
  layout/                   # Header, Footer
  apps/                     # AppCard, DistributionPanel
  admin/                    # AdminShell, managers, gráficos
lib/
  prisma.ts, api-response.ts, validation.ts, password.ts, jwt.ts,
  rate-limit.ts, analytics.ts, safe-data.ts, admin-guard.ts, utils.ts
modules/
  auth/ applications/ categories/ distributions/ versions/
  analytics/ content/ banners/ stats/ settings/
prisma/
  schema.prisma, migrations/, seed.ts
tests/unit/
proxy.ts                    # Proteção de primeira linha (Next 16)
```

## Fluxo de uma requisição

### Público

```
Página/API → service → repository → Prisma → PostgreSQL
                         ↓
                  analytics (VIEW / CLICK, fire-and-forget)
```

`safePublicQuery` envolve consultas em páginas: se o banco falhar, a página
renderiza um estado vazio honesto (nunca dados fictícios) e as APIs retornam
503 com `DATABASE_UNAVAILABLE`.

### Admin

```
proxy.ts (cookie presente?)
   ↓
layout /admin (getSession: JWT + sessão no banco)
   ↓
api/admin/** (requireAdmin → 401 se inválido)
   ↓
service → repository → audit_log
```

## Decisões técnicas relevantes

| Decisão | Motivo |
| --- | --- |
| Next.js 16 com `cacheComponents: false` | Rotas dependem de Prisma e cookies; renderização dinâmica explícita. |
| `proxy.ts` em vez de `middleware.ts` | Convenção do Next 16. |
| Prisma 6.19.3 fixado + overrides `effect@3.22.5` / `deepmerge-ts@8.0.2` | 0 vulnerabilidades no `npm audit` e CLI funcional. |
| Argon2id (64 MiB, t=3, p=4) | Resistente a GPU. |
| JWT em cookie HttpOnly + sessão persistida | Revogação real; CSRF mitigado por SameSite=Lax. |
| Hash de IP com salt para analytics | LGPD: dado bruto nunca persistido. |
| `DailyStat.applicationId` obrigatório | Simplifica `upsert` e garante integridade. |
| Sem `use cache` | Dados mudam pelo admin; cache exigiria invalidação por tag. |

## Expansão futura (preparada, não ativada)

- `Ownership.VIXT | THIRD_PARTY` e `Publisher.approved` existem no schema.
- `publicWhere` filtra `ownership: VIXT`.
- Nenhuma rota pública de desenvolvedor, comissão ou cobrança existe hoje.

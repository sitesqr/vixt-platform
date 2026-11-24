# Distribuição — Web, Desktop (Windows) e Android

Este documento cobre as **novas modalidades de distribuição** adicionadas sem
alterar a plataforma existente. O portal, o catálogo, o design e as APIs
continuam os mesmos.

---

## 1. Visão geral

| Modalidade | Status | Onde configurar |
|---|---|---|
| Web | ✅ Funcionando (inalterado) | `LINK_<APP>_WEB` / painel admin |
| Desktop Windows | 🛠️ Estrutura pronta; **nenhum `.exe` gerado ainda** | `desktop/` + workflow manual |
| Android | ✅ APKs de demonstração de **Oficina** e **Barbearia** disponíveis; sem Play Store | `mobile/` |

**Regra de ouro:** nenhum botão de download aparece sem um binário real,
compilado, testado e com URL + SHA-256 válidos.

---

## 2. Modelo de dados (migration `20261124000000_distribution_platforms`)

`distributions` ganhou:

| Campo | Tipo | Uso |
|---|---|---|
| `platform` | `WEB \| WINDOWS \| ANDROID \| MACOS \| LINUX \| OTHER` | Agrupa botões na página |
| `availability` | `AVAILABLE \| COMING_SOON` | "Em breve" nunca gera link |
| `fileName` | string? | Nome do instalador exibido |
| `fileSizeBytes` | bigint? | Tamanho exibido |
| `checksumSha256` | string? | Integridade do binário |
| `notes` | text? | Observações internas |

Índice composto `(applicationId, platform, availability)` adicionado.

---

## 3. Aplicativos que podem gerar instaladores

O wrapper desktop é **genérico** — qualquer aplicativo web da VIXT pode ser
empacotado. Os configs já criados são:

| App | Config | Status |
|---|---|---|
| VIXT Oficina | `desktop/apps/oficina.config.json` | Pronto para receber URL real |
| VIXT Barbearia | `desktop/apps/barbearia.config.json` | Pronto para receber URL real |

> Borracharia, Lava Rápido e Salão estão deliberadamente adiados no catálogo e
> **não** receberam config de desktop. Para incluí-los, basta adicionar o
> `<slug>.config.json` e o `<slug>.builder.json` seguindo o mesmo padrão.

### Por que Electron (e não Tauri)

Os aplicativos são Next.js/React web e o ambiente não possui toolchain Rust nem
cross-compilation Windows. Electron permite gerar o `.exe` em um runner Windows
do GitHub Actions, apontando para a URL web existente — **sem tocar no código
nem no banco dos aplicativos**. Tauri pode ser reconsiderado no futuro se a
equipe adotar Rust.

### O que o instalador faz

- Abre o app em **janela independente**, com título e ícone próprios.
- Usa o **backend e banco já existentes** (via HTTPS).
- Restringe navegação às origens permitidas no config.
- Links externos abrem no navegador padrão.
- Auto-update está **estruturado** (`updateFeedUrl`), mas desativado até existir
  um release publicado.

---

## 4. Como gerar os arquivos `.exe`

### 4.1 Pré-requisito obrigatório: URL real

Edite `desktop/apps/<slug>.config.json`:

```json
{
  "startUrl": "https://app-real.vixt.com.br",
  "allowedOrigins": ["https://app-real.vixt.com.br"]
}
```

⚠️ Enquanto o valor contiver `SUBSTITUA`, o workflow **falha de propósito** —
isso impede a geração de um instalador que aponta para lugar nenhum.

### 4.2 Geração local (requer Windows)

```bash
cd desktop
npm install
python build/make-icons.py
npm run dist:oficina      # gera desktop/dist/oficina/*.exe
npm run dist:barbearia
```

### 4.3 Geração via GitHub Actions (recomendado)

1. GitHub → **Actions** → *VIXT Desktop — gerar instaladores Windows*.
2. Clique em **Run workflow** e escolha o app.
3. O workflow valida a URL, compila o NSIS instalador e faz upload do artefato.
4. Baixe o `.exe`, instale em uma máquina Windows e teste.

O workflow **não publica nada automaticamente** na VIXT Central.

---

## 5. Como disponibilizar os downloads na VIXT

Após testar o `.exe` e hospedá-lo (ex.: releases do GitHub ou CDN própria):

1. Calcule o SHA-256 e o tamanho:

```bash
sha256sum vixt-oficina-1.0.0-setup.exe
stat -c%s vixt-oficina-1.0.0-setup.exe
```

2. Preencha no `.env` (ou no painel admin, se preferir cadastro manual):

```bash
LINK_OFICINA_WINDOWS="https://.../vixt-oficina-1.0.0-setup.exe"
LINK_OFICINA_WINDOWS_SHA256="<64 hex>"
LINK_OFICINA_WINDOWS_SIZE="<bytes>"
```

3. Rode o seed de distribuições:

```bash
npm run db:seed:distributions
```

O script **se recusa a cadastrar** instaladores sem URL http(s) ou sem SHA-256
válido — nenhum link fictício entra no catálogo.

4. (Opcional) Para anunciar Android sem link:

```bash
ANNOUNCE_ANDROID_COMING_SOON=true npm run db:seed:distributions
```

5. Verifique: abra `/aplicativos/oficina`. Devem aparecer:
   - **Web** → "Acessar versão web"
   - **Desktop** → "Baixar para Windows · nome do arquivo · tamanho"
   - **Próximas versões** → "Android — Em breve" (informativo, sem link)

Os cliques passam por `/api/public/redirect/:id`, que registra `DOWNLOAD` com
`confirmed: false` (instalação real não é confirmável) — lógica existente,
inalterada.

---

## 6. Android — demonstração já disponível

Foram gerados **APKs de demonstração da VIXT Oficina e da VIXT Barbearia**,
assinados com certificado debug, que abrem a página real de cada aplicativo via
WebView. Ambos estão cadastrados no catálogo com o botão **"Baixar para Android"**.

| App | Tamanho | SHA-256 |
|---|---|---|
| Oficina | 4.052.194 B | `d5fbb042…7053e` |
| Barbearia | 4.339.895 B | `190420b8…71bba` |

Detalhes completos em [`mobile/docs/ANDROID.md`](./mobile/docs/ANDROID.md).

### O que ainda falta para a Play Store

1. URL HTTPS real do aplicativo (remover `cleartext`).
2. Keystore de assinatura definitivo da VIXT + build release.
3. Ícone adaptativo, splash e testes em dispositivo físico.
4. Política de privacidade/termos dentro do app.
5. Conta Google Play Console, listing e upload do AAB.

**Nada disso foi feito** — nenhum app foi publicado na Play Store.

---

## 7. Arquivos criados/alterados

| Arquivo | Finalidade |
|---|---|
| `prisma/schema.prisma` | Novos campos/enums de distribuição |
| `prisma/migrations/20261124000000_distribution_platforms/migration.sql` | Migration incremental |
| `modules/applications/{types,service}.ts` | Agrupamento Web/Desktop/Mobile/Em breve |
| `components/apps/distribution-panel.tsx` | Painel visual na página do app |
| `app/(public)/aplicativos/[slug]/page.tsx` | Usa o novo painel |
| `desktop/**` | Wrapper Electron, configs, ícones, CI |
| `mobile/**` | Preparação Capacitor (sem build) |
| `prisma/seed-distributions.ts` | Cadastro seguro de binários reais |
| `.github/workflows/desktop-build.yml` | Build manual de `.exe` no Windows |
| `.env.example`, `DISTRIBUTION.md` | Configuração e documentação |

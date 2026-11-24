# Android — demonstrações funcionais

## Estado atual

✅ Dois APKs de demonstração gerados, validados e disponíveis no catálogo.

| App | Pacote | Tamanho | SHA-256 | Label |
|---|---|---|---|---|
| VIXT Oficina | `br.com.vixt.oficina.demo` | 4.052.194 B | `d5fbb0427784c2037871f471a454568edc53d861a5086197d389d1f11597053e` | VIXT Oficina (Demo) |
| VIXT Barbearia | `br.com.vixt.barbearia.demo` | 4.339.895 B | `190420b868b0c4192e3d73325b133067cfb3950612a3a47aa8ccd2d5f1771bba` | VIXT Barbearia (Demo) |

- Versão 1.0 (versionCode 1), compileSdk/targetSdk 35, assinatura debug v1/v2.
- Cada APK abre a página real do respectivo aplicativo via WebView
  (`http://10.0.2.2:3000/aplicativos/<slug>` — host do emulador).
- **Não são builds de produção**, não usam keystore definitivo e **não foram
  publicados na Play Store**.

## Como foram gerados

1. Android SDK 35 + build-tools 35 e JDK 21 (Capacitor 7 exige Java 21),
   instalados em `/tmp/opencode` (fora do repositório).
2. Para cada app: ajustar `capacitor.config.json` (appId, appName, URL),
   `android/app/build.gradle` (applicationId/namespace) e
   `res/values/strings.xml` (label), então:

```bash
export JAVA_HOME=/caminho/jdk-21
export ANDROID_HOME=/caminho/android-sdk
cd mobile
npm install
npx cap sync android
cd android && ./gradlew assembleDebug --no-daemon
cp app/build/outputs/apk/debug/app-debug.apk ../artifacts/vixt-<app>-1.0.0-demo.apk
```

3. Validar com `aapt dump badging` e `apksigner verify`.
4. Cadastrar via `npm run db:seed:distributions` com URL + SHA-256 + tamanho.

## Disponível na VIXT

Ambas as páginas exibem **"Baixar para Android"**. Os arquivos são servidos por
`/api/public/downloads/vixt-<app>-1.0.0-demo.apk` (rota com allowlist).
Os cliques passam pelo redirect existente, que registra `DOWNLOAD` com
`confirmed: false`.

## Antes da Play Store

- [ ] URL HTTPS real (remover `cleartext`)
- [ ] Keystore de assinatura definitivo + build release/AAB
- [ ] Ícone adaptativo e splash definitivos
- [ ] Teste em dispositivo físico
- [ ] Política de privacidade e termos no app
- [ ] Google Play Console + listing + upload
- [ ] Cadastro da distribuição `PLAY_STORE` no admin

# Android — demonstração funcional (VIXT Oficina)

## Estado atual

✅ **APK de demonstração gerado e validado.**

| Item | Valor |
|---|---|
| Arquivo | `mobile/artifacts/vixt-oficina-1.0.0-demo.apk` (copiado de `android/app/build/outputs/apk/debug/`) |
| Tamanho | 4.052.194 bytes (~3,9 MB) |
| SHA-256 | `d5fbb0427784c2037871f471a454568edc53d861a5086197d389d1f11597053e` |
| Pacote | `br.com.vixt.oficina.demo` |
| Versão | 1.0 (versionCode 1) |
| Assinatura | Debug (v1 + v2), **não é assinatura de produção** |
| URL no app | `http://10.0.2.2:3000/aplicativos/oficina` (host do emulador) |
| Play Store | ❌ Não publicado |

> Este APK é uma **demonstração técnica**: ele abre a página real da VIXT
> Oficina dentro de uma WebView nativa. Não é uma versão de produção, não usa
> keystore definitivo e não será enviado à Google Play.

## Como foi gerado

1. Android SDK command-line tools + plataforma 35 + build-tools 35 instalados
   em `/tmp/opencode/android-sdk` (fora do repositório).
2. JDK 21 (Temurin) em `/tmp/opencode/jdk21` — Capacitor 7 exige Java 21.
3. `npm install` em `mobile/` (Capacitor 7.6.10).
4. `capacitor.config.json` aponta para `http://10.0.2.2:3000`.
5. `android:usesCleartextTraffic="true"` no AndroidManifest para permitir http
   na demonstração.
6. `npx cap add android` → `./gradlew assembleDebug`.

## Como reproduzir

```bash
# pré-requisitos: JDK 21 e Android SDK 35
export JAVA_HOME=/caminho/para/jdk-21
export ANDROID_HOME=/caminho/para/android-sdk

cd mobile
npm install
npm run apk:demo
```

## Como está disponível na VIXT

O botão **"Baixar para Android"** aparece na página da VIXT Oficina e aponta
para `/api/public/downloads/vixt-oficina-1.0.0-demo.apk`, que serve o arquivo
com `Content-Type: application/vnd.android.package-archive`.

O cadastro foi feito com `npm run db:seed:distributions`, usando URL + SHA-256
+ tamanho reais — nenhum link fictício.

Barbearia continua exibindo **"Android — Em breve"** (sem APK).

## O que ainda falta para produção / Play Store

- [ ] URL HTTPS real do aplicativo (remover cleartext).
- [ ] Keystore de assinatura definitivo da VIXT (não o debug).
- [ ] `./gradlew assembleRelease` assinado.
- [ ] Ícone adaptativo e splash screen definitivos.
- [ ] Teste em dispositivo físico.
- [ ] Política de privacidade e termos dentro do app.
- [ ] Conta Google Play Console + listing + upload do AAB.
- [ ] Cadastro da distribuição `PLAY_STORE` no painel admin.

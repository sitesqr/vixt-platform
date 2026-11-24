# Android — demonstrações funcionais

## Estado atual

✅ Dois APKs **release, assinados com keystore próprio da VIXT**.

| App | Pacote | Tamanho | SHA-256 |
|---|---|---|---|
| VIXT Oficina | `br.com.vixt.oficina.demo` | 3.151.864 B | `6f207ef0e959c73657e11b7abdf1dd23b9f6498abbc099c7cc7076e5384b8df0` |
| VIXT Barbearia | `br.com.vixt.barbearia.demo` | 3.151.844 B | `89707699f270921972e3c4bfbfdc7f7f569ef6a58cbcd955615f6b864a349163` |

- Certificado: `CN=VIXT, OU=Desenvolvimento, O=VIXT, ...`
- SHA-256 do certificado: `f13e7ef78901d0b962e9ad42d753ed783a1cd2d5a9ab58051edeffe38b33a5b2`
- Assinatura v1/v2 verificada com `apksigner`.
- São APKs de **demonstração** (URL local `10.0.2.2`, cleartext), sem Play Store.

## Sobre o aviso "O arquivo pode ser nocivo"

O Android exibe esse aviso para **qualquer APK instalado fora da Play Store**
(sideload). Ele não indica que o arquivo está corrompido — os nossos passam
por `apksigner verify` e têm assinatura release VIXT.

Para reduzir o alerta:

1. ✅ Assinatura release (não debug) — **feito**.
2. Baixe sempre pelo link oficial `https://vixt-central.onrender.com/...`.
3. Confira o SHA-256 acima com `sha256sum` após o download.
4. Ao instalar, toque em **"Baixar mesmo assim"** e depois **"Instalar"**.
   O Google Play Protect pode continuar avisando até o app ser publicado na
   Play Store — isso é comportamento padrão do Android, não erro da VIXT.

## Keystore

O keystore `vixt-release.keystore` fica **fora do repositório** (em `/tmp/opencode`
neste ambiente). Em produção deve ser guardado em cofre secreto. A senha também
não é versionada (`android/keystore.properties` está no `.gitignore`).

Nunca perca o keystore: atualizações de um app assinado exigem a **mesma chave**.

## Como gerar

```bash
export JAVA_HOME=/caminho/jdk-21
export ANDROID_HOME=/caminho/android-sdk
cd mobile
npm install
npx cap sync android
cd android && ./gradlew assembleRelease --no-daemon
cp app/build/outputs/apk/release/app-release.apk ../artifacts/vixt-<app>-1.0.0-demo.apk
```

## Antes da Play Store

- [ ] URL HTTPS real (remover cleartext)
- [ ] Keystore de produção em cofre (pode ser o atual, bem guardado)
- [ ] AAB assinado + upload
- [ ] Ícone adaptativo e splash definitivos
- [ ] Teste em dispositivo físico
- [ ] Política de privacidade/termos no app
- [ ] Listing na Google Play Console

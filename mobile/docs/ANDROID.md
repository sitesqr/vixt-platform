# Android — preparação estrutural (não implementado)

Esta pasta existe apenas para **preparar** a futura versão Android dos
aplicativos VIXT. Nenhum APK foi gerado, nenhum projeto Android foi criado e
nada será publicado na Google Play Store nesta etapa.

## Tecnologia escolhida: Capacitor

Os aplicativos são Next.js/React web. Capacitor permite reutilizar esse código
em um WebView nativo Android, com acesso a recursos do dispositivo quando
necessário — sem reconstruir os aplicativos.

## Por que ainda não há build

1. As URLs reais dos aplicativos não foram fornecidas (`SUBSTITUA-...`).
2. Nenhum APK foi compilado e testado.
3. A regra da plataforma é não apresentar como disponível o que não existe.

## Como será quando autorizado

```bash
cd mobile
npm install
cp capacitor.config.example.json capacitor.config.json
# editar appId, appName e server.url com a URL real
npx cap add android
npm run build:android     # após implementar o build do app web
npx cap sync android
```

Depois: gerar APK assinado, testar em dispositivo real, e somente então
cadastrar a distribuição `ANDROID` no painel admin da VIXT Central.

## Checklist antes de publicar

- [ ] URL real do aplicativo definida
- [ ] Build web de produção funcionando
- [ ] APK assinado com keystore próprio da VIXT
- [ ] Teste em dispositivo Android real
- [ ] Ícone e splash screen definitivos
- [ ] Política de privacidade e termos no app
- [ ] Conta Google Play Console e listing
- [ ] Cadastro da distribuição no admin (platform `ANDROID`, `PLAY_STORE`)

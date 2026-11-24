# Android — PWA (abordagem atual)

## Mudança de abordagem

A distribuição via **APK** foi **descontinuada nesta versão**. O Android exibe
o aviso "O arquivo pode ser nocivo" (Google Play Protect) para qualquer APK
instalado fora da Play Store. Para evitar esse aviso, os aplicativos agora são
disponibilizados como **PWA**: o visitante instala pelo próprio navegador, sem
sideload e sem aviso de segurança.

> Os APKs release assinados continuam no repositório como artefatos técnicos,
> mas **não são mais exibidos no catálogo**.

## Como funciona agora

- A VIXT Central tem `manifest.webmanifest`, `sw.js` e ícones 192/512.
- O catálogo exibe um **botão "Instalar aplicativo (PWA)"**.
- Ao clicar, o componente captura o evento `beforeinstallprompt` do Chrome e
  chama `prompt()` **dentro do clique do usuário** — o que instala de fato.
- Se o navegador não oferecer o prompt (iOS/Safari), o botão mostra instruções
  para "Adicionar à Tela Inicial".
- Nenhum download de `.apk` é oferecido — logo, nenhum aviso do Play Protect.

## Distribuição no banco

| App | Distribuições ativas |
|---|---|
| VIXT Oficina | Web (sistema real) + PWA (instalação pelo navegador) |
| VIXT Barbearia | Web (sistema real) + PWA (instalação pelo navegador) |

As distribuições `ANDROID/APK` foram removidas do catálogo.

## Para voltar a APK no futuro

Só quando houver publicação na Play Store (AAB assinado + listing). O keystore
de release VIXT está documentado no CHANGELOG 0.3.1 e guardado fora do Git.

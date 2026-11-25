# Android — instalação com um clique

## Abordagem final

O Chrome/Android **nunca instala PWA silenciosamente** — sempre exige uma
confirmação. Para atender o pedido de "um clique", criamos um **APK instalador
leve** (~12 KB) que, ao ser aberto, direciona diretamente para a página do
aplicativo na VIXT Central, onde a PWA é instalada. O usuário baixa o APK com
um clique no botão **"Baixar aplicativo no celular"**.

| App | URL de download | Tamanho | SHA-256 |
|---|---|---|---|
| VIXT Oficina | `/api/public/downloads/vixt-oficina-instalador-v1.apk` | 12.717 B | `b2162c09968bab004cdc3df173d9b3bbb3ae0f922cc22db9db6170894b70cc2d` |
| VIXT Barbearia | `/api/public/downloads/vixt-barbearia-instalador-v1.apk` | 12.725 B | `17d0d23f0c5167ebb1f1444d12008697d2eaf678e147e0f13f63a5d8c3e26229` |

Os arquivos são servidos com nomes **versionados**
(`VIXT-Oficina-Instalador-v1.apk`, `VIXT-Barbearia-Instalador-v1.apk`) e
`Cache-Control: no-store`, evitando o diálogo "Baixar o arquivo novamente?".
O link também usa o atributo `download` do HTML.

- Pacotes: `br.com.vixt.pwaapk.oficina` / `br.com.vixt.pwaapk.barbearia`
- Assinados com o keystore de release VIXT (`CN=VIXT`).
- Código-fonte em `pwa-apk/` (Activity mínima que abre a URL da PWA).
- **Não há versão Desktop** — apenas mobile.

## Nota sobre o aviso do Android

Como todo APK fora da Play Store, o Google Play Protect pode exibir
"O arquivo pode ser nocivo" na **primeira instalação**. O arquivo é assinado
pela VIXT e tem ~12 KB — apenas um redirecionador para a PWA oficial.
Confira o SHA-256 acima e toque em "Instalar mesmo assim".

Para eliminar definitivamente o aviso, só com publicação na Play Store.

package br.com.vixt.pwaapk;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

/**
 * Instalador PWA da VIXT.
 * Abre a página do aplicativo no navegador do sistema. O Chrome detecta a PWA
 * e oferece a instalação na tela inicial. Um toque no ícone do app inicia
 * este fluxo — sem download de arquivos adicionais.
 */
public class InstallerActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // URL configurada no build via manifest placeholder / resources.
        String url = getString(R.string.pwa_url);
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            startActivity(intent);
        } finally {
            finish();
        }
    }
}

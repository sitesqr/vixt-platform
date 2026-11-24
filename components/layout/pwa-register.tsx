"use client";

import { useEffect } from "react";

/**
 * Registra o service worker da PWA VIXT e garante que versões antigas do cache
 * (vixt-v1, com links de APK) sejam substituídas imediatamente.
 */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // Se já existia um service worker antigo, força a atualização.
        registration.update().catch(() => {});
        registration.addEventListener("updatefound", () => {
          const incoming = registration.installing;
          if (!incoming) return;
          incoming.addEventListener("statechange", () => {
            if (
              incoming.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Nova versão pronta: recarrega uma vez para limpar cache antigo.
              const key = "vixt-pwa-reloaded";
              if (!sessionStorage.getItem(key)) {
                sessionStorage.setItem(key, "1");
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(() => {
        // PWA é progressivo: falha no registro não quebra o portal.
      });
  }, []);

  return null;
}

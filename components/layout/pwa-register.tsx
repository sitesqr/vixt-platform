"use client";

import { useEffect } from "react";

/** Registra o service worker da PWA VIXT (somente em produção). */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // PWA é progressivo: falha no registro não quebra o portal.
      });
  }, []);
  return null;
}

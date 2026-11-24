"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Botão de instalação PWA.
 * Captura o beforeinstallprompt do Chromium e chama prompt() dentro do clique
 * do usuário — única forma de instalar de fato no Android/Chrome.
 * Em navegadores sem suporte (iOS/Safari), exibe instruções passo a passo.
 */
export function PwaInstallButton({ label = "Instalar aplicativo" }: { label?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [platform] = useState<"android" | "ios" | "desktop" | "unknown">(() => {
    if (typeof window === "undefined") return "unknown";
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    return isIOS ? "ios" : /Android/i.test(ua) ? "android" : "desktop";
  });

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) {
      setShowHelp(true);
      return;
    }
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setDeferred(null);
  }, [deferred]);

  if (installed) {
    return (
      <div className="flex min-h-12 items-center gap-3 rounded-xl border border-[#a7f3d0] bg-[#ecfdf5] px-4 text-sm font-bold text-[#047857]">
        <Check size={18} /> Aplicativo instalado
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={install}
        className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-[#eff6ff] px-4 py-2.5 text-sm font-bold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
      >
        <Download size={18} className="shrink-0" />
        <span className="flex-1 text-left">{label}</span>
      </button>
      {showHelp && (
        <p className="mt-2 rounded-lg bg-[#f8fafc] p-3 text-xs leading-5 text-[#64748b]">
          {platform === "ios"
            ? "No iPhone: toque no botão Compartilhar do Safari e escolha “Adicionar à Tela Inicial”."
            : platform === "android"
              ? "Abra o menu do Chrome (⋮) e toque em “Instalar aplicativo” ou “Adicionar à tela inicial”."
              : "No computador, use o ícone de instalação na barra de endereço do Chrome."}
        </p>
      )}
    </div>
  );
}

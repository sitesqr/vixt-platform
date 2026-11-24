"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __vixtInstallPrompt?: BeforeInstallPromptEvent;
  }
}

/**
 * Botão de instalação PWA.
 *
 * O evento beforeinstallprompt é capturado por um script inline no <head>
 * (antes da hidratação) e também aqui, para cobrir os dois cenários.
 * O prompt() é chamado DENTRO do clique — exigência do Chrome.
 */
export function PwaInstallButton({ label = "Instalar aplicativo" }: { label?: string }) {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
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
    // Pega o evento capturado cedo pelo script inline, se houver.
    if (window.__vixtInstallPrompt) {
      deferredRef.current = window.__vixtInstallPrompt;
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      const typed = event as BeforeInstallPromptEvent;
      window.__vixtInstallPrompt = typed;
      deferredRef.current = typed;
    };
    const onInstalled = () => {
      setInstalled(true);
      deferredRef.current = null;
      window.__vixtInstallPrompt = undefined;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    const prompt = deferredRef.current ?? window.__vixtInstallPrompt;
    if (!prompt) {
      setShowHelp(true);
      return;
    }
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch {
      setShowHelp(true);
    }
    deferredRef.current = null;
    window.__vixtInstallPrompt = undefined;
  }, []);

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
            ? "No iPhone: toque em Compartilhar no Safari e escolha “Adicionar à Tela Inicial”."
            : platform === "android"
              ? "Abra o menu do Chrome (⋮) e toque em “Instalar aplicativo” ou “Adicionar à tela inicial”."
              : "Use o ícone de instalação na barra de endereço do Chrome."}
        </p>
      )}
    </div>
  );
}

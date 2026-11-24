import {
  Download,
  ExternalLink,
  Globe,
  Monitor,
  Smartphone,
  AppWindow,
} from "lucide-react";
import type { DistributionButton, DistributionGroup } from "@/modules/applications";
import type { DistributionPlatform } from "@prisma/client";
import { PwaInstallButton } from "@/components/layout/pwa-install";

const platformMeta: Record<
  DistributionPlatform,
  { label: string; icon: typeof Globe; soonLabel: string }
> = {
  WEB: {
    label: "Navegador",
    icon: Globe,
    soonLabel: "Web — Em breve",
  },
  WINDOWS: {
    label: "Windows",
    icon: Monitor,
    soonLabel: "Windows — Em breve",
  },
  ANDROID: {
    label: "Android",
    icon: Smartphone,
    soonLabel: "Android — Em breve",
  },
  MACOS: { label: "macOS", icon: AppWindow, soonLabel: "macOS — Em breve" },
  LINUX: { label: "Linux", icon: AppWindow, soonLabel: "Linux — Em breve" },
  OTHER: { label: "Outros", icon: ExternalLink, soonLabel: "Em breve" },
};

function formatSize(bytes: string | null): string | null {
  if (!bytes) return null;
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value >= 1024 * 1024
    ? `${(value / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(value / 1024)} KB`;
}

function ActiveButton({ button }: { button: DistributionButton }) {
  const Icon =
    button.type === "PWA"
      ? Monitor
      : (platformMeta[button.platform]?.icon ?? Download);
  const size = formatSize(button.fileSizeBytes);

  // PWA precisa de um clique real para disparar o beforeinstallprompt.
  if (button.type === "PWA") {
    return <PwaInstallButton label={button.label} />;
  }

  return (
    <a
      href={`/api/public/redirect/${button.id}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex min-h-12 items-center gap-3 rounded-xl bg-[#eff6ff] px-4 py-2.5 text-sm font-bold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
    >
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">
        {button.label}
        {(button.fileName || size) && (
          <span className="block text-[11px] font-medium text-[#64748b]">
            {button.fileName}
            {button.fileName && size ? " · " : ""}
            {size}
          </span>
        )}
      </span>
      <Download size={15} className="shrink-0 opacity-60" />
    </a>
  );
}

/**
 * Painel de distribuição da página do aplicativo.
 * Exibe somente versões reais (com link ativo). Itens "Em breve" são
 * informativos e nunca geram link clicável — evita download fictício.
 */
export function DistributionPanel({ groups }: { groups: DistributionGroup }) {
  const { web, desktop, mobile, comingSoon } = groups;
  const hasAnyLink = web.length + desktop.length + mobile.length > 0;

  return (
    <div className="mt-4 space-y-5">
      {web.length > 0 && (
        <section>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">
            Web
          </p>
          <div className="space-y-2">
            {web.map((button) => (
              <ActiveButton key={button.id} button={button} />
            ))}
          </div>
        </section>
      )}

      {desktop.length > 0 && (
        <section>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">
            Desktop
          </p>
          <div className="space-y-2">
            {desktop.map((button) => (
              <ActiveButton key={button.id} button={button} />
            ))}
          </div>
        </section>
      )}

      {mobile.length > 0 && (
        <section>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">
            Mobile
          </p>
          <div className="space-y-2">
            {mobile.map((button) => (
              <ActiveButton key={button.id} button={button} />
            ))}
          </div>
        </section>
      )}

      {comingSoon.length > 0 && (
        <section>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-[#94a3b8] uppercase">
            Próximas versões
          </p>
          <div className="space-y-2">
            {comingSoon.map((platform) => {
              const meta = platformMeta[platform] ?? platformMeta.OTHER;
              const Icon = meta.icon;
              return (
                <div
                  key={platform}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 text-sm font-semibold text-[#94a3b8]"
                  aria-label={meta.soonLabel}
                >
                  <Icon size={18} className="shrink-0" />
                  {meta.soonLabel}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!hasAnyLink && comingSoon.length === 0 && (
        <p className="text-sm text-[#94a3b8]">Nenhum link de distribuição ativo.</p>
      )}
    </div>
  );
}

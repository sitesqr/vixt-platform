import { ArrowUpRight } from "lucide-react";
import type { DistributionGroup } from "@/modules/applications";

/** Exibe os botões de acesso à versão web do aplicativo. */
export function DistributionPanel({ groups }: { groups: DistributionGroup }) {
  return (
    <div className="mt-4 space-y-2">
      {groups.links.length > 0 ? (
        groups.links.map((button) => (
          <a
            key={button.id}
            href={`/api/public/redirect/${button.id}`}
            rel="noopener noreferrer nofollow"
            className="flex min-h-12 items-center gap-3 rounded-xl bg-[#eff6ff] px-4 text-sm font-bold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
          >
            <span className="flex-1">{button.label}</span>
            <ArrowUpRight size={18} className="shrink-0" />
          </a>
        ))
      ) : (
        <p className="text-sm text-[#94a3b8]">Link de acesso não disponível.</p>
      )}
    </div>
  );
}

import { StatsClient } from "@/components/admin/stats-client";
import { statsRepository } from "@/modules/stats";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Estatísticas" };

const empty = {
  totals: { applications: 0, published: 0, development: 0, categories: 0, views: 0, clicks: 0, downloads: 0 },
  topViewed: [],
  topDownloaded: [],
  timeline: [],
  recentActivity: [],
  newPublished: [],
};

export default async function AdminStatsPage() {
  const stats = await safePublicQuery(() => statsRepository.getDashboard(30), empty);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-[#0b1220]">Estatísticas</h2>
        <p className="mt-1 text-sm text-[#64748b]">
          Visualizações, cliques e downloads registrados. Instalações não são confirmadas automaticamente.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Visualizações", stats.totals.views],
          ["Cliques em botões", stats.totals.clicks],
          ["Downloads registrados", stats.totals.downloads],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <p className="text-sm font-semibold text-[#64748b]">{label as string}</p>
            <p className="mt-2 text-3xl font-black text-[#0b1220]">{(value as number).toLocaleString("pt-BR")}</p>
          </div>
        ))}
      </div>
      <StatsClient timeline={stats.timeline} topViewed={stats.topViewed} />
    </div>
  );
}

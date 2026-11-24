"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TimelinePoint {
  date: string;
  views: number;
  clicks: number;
  downloads: number;
}

export function StatsClient({
  timeline,
  topViewed,
}: {
  timeline: TimelinePoint[];
  topViewed: { id: string; name: string; slug: string; views: number }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <h3 className="font-extrabold text-[#0b1220]">Evolução (30 dias)</h3>
        {timeline.length ? (
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f6bff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2f6bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#2f6bff" fill="url(#views)" name="Visualizações" />
                <Area type="monotone" dataKey="clicks" stroke="#06b6d4" fill="transparent" name="Cliques" />
                <Area type="monotone" dataKey="downloads" stroke="#16a34a" fill="transparent" name="Downloads" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-6 grid h-64 place-items-center text-sm text-[#94a3b8]">
            Sem dados de navegação neste período.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <h3 className="font-extrabold text-[#0b1220]">Mais acessados</h3>
        {topViewed.length ? (
          <ol className="mt-4 space-y-3">
            {topViewed.map((app, i) => (
              <li key={app.id} className="flex items-center gap-3 text-sm">
                <span className="grid size-6 place-items-center rounded-md bg-[#eff6ff] text-xs font-black text-[#2563eb]">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-semibold text-[#1e293b]">{app.name}</span>
                <span className="text-xs text-[#64748b]">{app.views}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-sm text-[#94a3b8]">Sem dados de acesso neste período.</p>
        )}
      </section>
    </div>
  );
}

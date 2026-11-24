import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "./types";

function since(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export const statsRepository = {
  async getDashboard(days = 30): Promise<DashboardStats> {
    const from = since(days);
    const [appCount, published, development, categories, eventCounts, topViewed, topDownloaded, daily, activity, newPublished] =
      await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { published: true, status: "AVAILABLE" } }),
        prisma.application.count({ where: { status: "DEVELOPMENT" } }),
        prisma.category.count({ where: { active: true } }),
        prisma.analyticsEvent.groupBy({
          by: ["type"],
          where: { createdAt: { gte: from } },
          _count: { _all: true },
        }),
        prisma.analyticsEvent.groupBy({
          by: ["applicationId"],
          where: { type: "VIEW", createdAt: { gte: from }, applicationId: { not: null } },
          _count: { _all: true },
          orderBy: { _count: { applicationId: "desc" } },
          take: 5,
        }),
        prisma.analyticsEvent.groupBy({
          by: ["applicationId"],
          where: { type: "DOWNLOAD", createdAt: { gte: from }, applicationId: { not: null } },
          _count: { _all: true },
          orderBy: { _count: { applicationId: "desc" } },
          take: 5,
        }),
        prisma.dailyStat.findMany({
          where: { date: { gte: from } },
          orderBy: { date: "asc" },
        }),
        prisma.auditLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          include: { admin: { select: { name: true } } },
        }),
        prisma.application.findMany({
          where: { published: true, releasedAt: { gte: from } },
          orderBy: { releasedAt: "desc" },
          take: 5,
          select: { id: true, name: true, slug: true, releasedAt: true },
        }),
      ]);

    const ids = [...topViewed, ...topDownloaded]
      .map((r) => r.applicationId)
      .filter((v): v is string => Boolean(v));
    const apps = ids.length
      ? await prisma.application.findMany({
          where: { id: { in: [...new Set(ids)] } },
          select: { id: true, name: true, slug: true },
        })
      : [];
    const appById = new Map(apps.map((a) => [a.id, a]));

    const countOf = (type: string) =>
      eventCounts.find((e) => e.type === type)?._count._all ?? 0;

    const timelineMap = new Map<string, { date: string; views: number; clicks: number; downloads: number }>();
    for (const row of daily) {
      const key = row.date.toISOString().slice(0, 10);
      const entry = timelineMap.get(key) ?? { date: key, views: 0, clicks: 0, downloads: 0 };
      entry.views += row.views;
      entry.clicks += row.clicks;
      entry.downloads += row.downloads;
      timelineMap.set(key, entry);
    }

    return {
      totals: {
        applications: appCount,
        published,
        development,
        categories,
        views: countOf("VIEW"),
        clicks: countOf("CLICK"),
        downloads: countOf("DOWNLOAD"),
      },
      topViewed: topViewed.flatMap((r) => {
        const a = r.applicationId ? appById.get(r.applicationId) : null;
        return a ? [{ ...a, views: r._count._all }] : [];
      }),
      topDownloaded: topDownloaded.flatMap((r) => {
        const a = r.applicationId ? appById.get(r.applicationId) : null;
        return a ? [{ ...a, downloads: r._count._all }] : [];
      }),
      timeline: [...timelineMap.values()],
      recentActivity: activity.map((a) => ({
        id: a.id,
        action: a.action,
        entityType: a.entityType,
        createdAt: a.createdAt.toISOString(),
        adminName: a.admin?.name ?? null,
      })),
      newPublished: newPublished.map((a) => ({
        ...a,
        releasedAt: a.releasedAt?.toISOString() ?? null,
      })),
    };
  },
};

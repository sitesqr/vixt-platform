import type { MetadataRoute } from "next";
import { applicationsService } from "@/modules/applications";
import { categoriesService } from "@/modules/categories";
import { safePublicQuery } from "@/lib/safe-data";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [apps, categories] = await Promise.all([
    safePublicQuery(() => applicationsService.getPopular(), []),
    safePublicQuery(() => categoriesService.listPublic(), []),
  ]);

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/aplicativos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categorias`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...apps.map((app) => ({
      url: `${base}/aplicativos/${app.slug}`,
      lastModified: app.releasedAt ? new Date(app.releasedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((cat) => ({
      url: `${base}/aplicativos?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

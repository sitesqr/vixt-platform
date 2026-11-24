import { ApplicationsManager } from "@/components/admin/applications-manager";
import { applicationsService } from "@/modules/applications";
import { categoriesService } from "@/modules/categories";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Aplicativos" };

export default async function AdminApplicationsPage() {
  const [apps, categories] = await Promise.all([
    safePublicQuery(() => applicationsService.listAdmin(), []),
    safePublicQuery(() => categoriesService.listAdmin(), []),
  ]);
  return (
    <ApplicationsManager
      initialApps={JSON.parse(JSON.stringify(apps))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}

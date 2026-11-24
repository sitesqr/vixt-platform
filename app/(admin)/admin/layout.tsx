import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

/** Layout do painel protegido. /admin/login fica FORA deste grupo. */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getSession();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell admin={{ name: admin.name, email: admin.email, role: admin.role }}>
      {children}
    </AdminShell>
  );
}

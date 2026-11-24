"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Blocks,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Tags,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/aplicativos", label: "Aplicativos", icon: Blocks },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/banners", label: "Banners", icon: Images },
  { href: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { href: "/admin/estatisticas", label: "Estatísticas", icon: BarChart3 },
];

export function AdminShell({
  children,
  admin,
}: {
  children: ReactNode;
  admin: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-18 items-center border-b border-white/10 px-6">
        <Logo inverse />
        <span className="ml-3 rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-white/70 uppercase">
          Admin
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4" aria-label="Navegação administrativa">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-[#2f6bff] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-bold text-white">{admin.name}</p>
          <p className="truncate text-xs text-white/50">{admin.email}</p>
          <p className="mt-1 text-[10px] font-bold tracking-wide text-[#60a5fa] uppercase">
            {admin.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] lg:flex">
      <aside className="hidden w-64 shrink-0 bg-[#0b1220] lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-[#0b1220]">{sidebar}</aside>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg bg-white/10 text-white"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex h-18 items-center gap-4 border-b border-[#e2e8f0] bg-white px-5 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="grid size-9 place-items-center rounded-lg border border-[#e2e8f0] lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#0b1220]">VIXT Central</h1>
            <p className="text-xs text-[#94a3b8]">Painel administrativo</p>
          </div>
          <Link
            href="/"
            className="ml-auto text-sm font-semibold text-[#2563eb] hover:underline"
          >
            Ver portal →
          </Link>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

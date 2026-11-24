"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Início" },
  { href: "/aplicativos", label: "Aplicativos" },
  { href: "/categorias", label: "Categorias" },
  { href: "/#sobre", label: "Sobre a VIXT" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] vixt-glass">
      <div className="vixt-container flex h-18 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("#")[0]) &&
                  link.href !== "/#sobre";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#eff6ff] text-[#1d4ed8]"
                    : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0b1220]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/aplicativos"
            className="inline-flex h-10 items-center rounded-xl bg-[#0b1220] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e293b]"
          >
            Explorar aplicativos
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg border border-[#e2e8f0] text-[#0b1220] md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-[#e2e8f0] bg-white px-5 py-4 md:hidden"
          aria-label="Navegação mobile"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#1e293b] hover:bg-[#f1f5f9]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

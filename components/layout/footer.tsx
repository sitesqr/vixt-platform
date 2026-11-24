import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const columns = [
  {
    title: "Plataforma",
    links: [
      { href: "/aplicativos", label: "Todos os aplicativos" },
      { href: "/categorias", label: "Categorias" },
      { href: "/aplicativos?sort=recent", label: "Lançamentos" },
    ],
  },
  {
    title: "VIXT",
    links: [
      { href: "/#sobre", label: "Sobre a VIXT" },
      { href: "/#beneficios", label: "Benefícios" },
      { href: "/#faq", label: "Perguntas frequentes" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/contato", label: "Contato e suporte" },
      { href: "/contato#privacidade", label: "Privacidade (LGPD)" },
      { href: "/contato#termos", label: "Termos de uso" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#e2e8f0] bg-white">
      <div className="vixt-container py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b]">
              Tecnologia que simplifica o seu dia a dia. Um ecossistema de
              aplicativos gratuitos, inteligentes e acessíveis.
            </p>
            <p className="mt-4 text-xs font-medium text-[#94a3b8]">
              Todos os aplicativos são desenvolvidos pela VIXT e gratuitos nesta
              primeira versão.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-bold text-[#0b1220]">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#64748b] transition-colors hover:text-[#2563eb]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[#e2e8f0] pt-6 text-xs text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VIXT. Todos os direitos reservados.</p>
          <p>
            Feito para simplificar — sem cadastro, sem assinatura, sem cobrança.
          </p>
        </div>
      </div>
    </footer>
  );
}

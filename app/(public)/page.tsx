import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  ExternalLink,
  Gift,
  Layers3,
  MousePointerClick,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppCard } from "@/components/apps/app-card";
import { applicationsService } from "@/modules/applications";
import { categoriesService } from "@/modules/categories";
import { contentService } from "@/modules/content";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";

const benefits = [
  {
    icon: Gift,
    title: "100% gratuitos",
    text: "Todos os aplicativos da VIXT são gratuitos nesta primeira versão — sem assinatura e sem cobrança.",
  },
  {
    icon: MousePointerClick,
    title: "Sem cadastro",
    text: "Navegue, conheça e baixe livremente. Nenhum login é exigido para usar o catálogo.",
  },
  {
    icon: ShieldCheck,
    title: "Feito pela VIXT",
    text: "Soluções desenvolvidas pela própria equipe, com padrão único de qualidade e suporte.",
  },
  {
    icon: Zap,
    title: "Simples e rápidos",
    text: "Interfaces diretas para o dia a dia de pessoas, profissionais e empresas.",
  },
];

const steps = [
  {
    number: "01",
    icon: Blocks,
    title: "Explore o ecossistema",
    text: "Encontre aplicativos por nome, segmento ou categoria.",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Conheça em detalhes",
    text: "Veja funcionalidades, versões e capturas de cada solução.",
  },
  {
    number: "03",
    icon: ExternalLink,
    title: "Use gratuitamente",
    text: "Acesse pelo navegador ou baixe pelo link disponível, sem burocracia.",
  },
];

export default async function HomePage() {
  const [apps, categories, content, faqs] = await Promise.all([
    safePublicQuery(() => applicationsService.getFeatured(), []),
    safePublicQuery(() => categoriesService.listPublic(), []),
    safePublicQuery(() => contentService.getPublicContent(), {}),
    safePublicQuery(() => contentService.listFaqs(), []),
  ]);

  const heroTitle =
    content["public.hero.title"]?.value ??
    "Tecnologia que simplifica o seu dia a dia.";
  const heroSubtitle =
    content["public.hero.subtitle"]?.value ??
    "Um ecossistema de aplicativos gratuitos para pessoais, profissionais e empresas. Conheça, escolha e comece a usar sem cadastro.";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-white">
        <div className="vixt-grid-bg absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-[#2f6bff]/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-40 -left-40 size-[420px] rounded-full bg-[#06b6d4]/10 blur-3xl" aria-hidden="true" />

        <div className="vixt-container relative grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div className="animate-fade-up">
            <Badge tone="blue" className="mb-6">
              <Sparkles size={13} /> Ecossistema VIXT
            </Badge>
            <h1 className="max-w-2xl text-4xl leading-[1.1] font-black tracking-[-0.045em] text-[#0b1220] sm:text-5xl lg:text-6xl">
              {heroTitle.split(" dia a dia.")[0]}{" "}
              <span className="vixt-gradient-text">dia a dia.</span>
              {!heroTitle.includes(" dia a dia.") && heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#475569]">
              {heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/aplicativos" size="lg">
                Explorar aplicativos <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="#sobre" variant="outline" size="lg">
                Conhecer a VIXT
              </ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#64748b]">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16a34a]" /> Gratuito
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16a34a]" /> Sem cadastro
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#16a34a]" /> Sem assinatura
              </span>
            </div>
          </div>

          {/* Painel visual abstrato — representa o ecossistema, sem dados falsos */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="animate-float relative mx-auto aspect-square max-w-md rounded-[2rem] border border-[#dbeafe] bg-gradient-to-br from-[#eff6ff] via-white to-[#ecfeff] p-8 shadow-[0_40px_100px_-40px_rgba(47,107,255,0.5)]">
              <div className="absolute inset-0 vixt-grid-bg rounded-[2rem] opacity-40" />
              <div className="relative grid h-full grid-cols-2 gap-4">
                {[
                  { label: "Gestão", icon: Layers3 },
                  { label: "Serviços", icon: Puzzle },
                  { label: "Produtividade", icon: Zap },
                  { label: "Gratuito", icon: Gift },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex flex-col justify-between rounded-2xl border border-white bg-white/90 p-5 shadow-lg ${i === 1 ? "translate-y-6" : ""}`}
                  >
                    <item.icon className="text-[#2f6bff]" size={26} />
                    <span className="text-sm font-bold text-[#1e293b]">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="animate-pulse-ring absolute -bottom-6 -left-6 grid size-20 place-items-center rounded-2xl bg-[#0b1220] text-xs font-black text-white shadow-xl">
                VIXT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="vixt-container py-20" id="beneficios">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-wider text-[#2563eb] uppercase">
            Por que VIXT
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0b1220] sm:text-4xl">
            Um ecossistema pensado para facilitar
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="vixt-card p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
                <b.icon size={22} />
              </span>
              <h3 className="mt-5 font-extrabold text-[#0b1220]">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APLICATIVOS EM DESTAQUE */}
      <section className="border-y border-[#e2e8f0] bg-white py-20">
        <div className="vixt-container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-wider text-[#2563eb] uppercase">
                Catálogo
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0b1220] sm:text-4xl">
                Aplicativos em destaque
              </h2>
              <p className="mt-3 text-[#64748b]">
                Conheça as soluções publicadas pela VIXT.
              </p>
            </div>
            <ButtonLink href="/aplicativos" variant="secondary">
              Ver todos <ArrowRight size={16} />
            </ButtonLink>
          </div>

          {apps.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="vixt-card mt-10 border-dashed p-10 text-center">
              <p className="font-semibold text-[#1e293b]">
                O catálogo está sendo preparado.
              </p>
              <p className="mt-2 text-sm text-[#64748b]">
                Os aplicativos publicados aparecerão aqui automaticamente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="vixt-container py-20">
          <h2 className="text-3xl font-black tracking-tight text-[#0b1220]">
            Explore por categoria
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/aplicativos?category=${cat.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 text-sm font-semibold text-[#1e293b] transition-all hover:border-[#2f6bff] hover:text-[#2563eb]"
              >
                {cat.name}
                <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-xs text-[#64748b]">
                  {cat.appCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section className="border-y border-[#e2e8f0] bg-[#0b1220] py-20 text-white">
        <div className="vixt-container">
          <h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Como funciona
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number} className="rounded-2xl border border-white/10 bg-white/5 p-7">
                <div className="flex items-center justify-between">
                  <s.icon className="text-[#60a5fa]" size={26} />
                  <span className="text-sm font-black text-white/30">{s.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="vixt-container py-20" id="sobre">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold tracking-wider text-[#2563eb] uppercase">
              Sobre a VIXT
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0b1220] sm:text-4xl">
              Tecnologia com propósito
            </h2>
            <p className="mt-5 leading-8 text-[#475569]">
              A VIXT desenvolve soluções digitais que simplificam atividades
              pessoais e profissionais. Nosso ecossistema reúne aplicativos
              gratuitos, inteligentes e acessíveis em um único lugar.
            </p>
            <p className="mt-4 leading-8 text-[#475569]">
              Nesta primeira versão, todos os aplicativos são desenvolvidos pela
              própria VIXT e distribuídos gratuitamente. A plataforma foi
              arquitetada para crescer de forma organizada e segura.
            </p>
          </div>
          <div className="vixt-gradient rounded-3xl p-1">
            <div className="rounded-[22px] bg-white p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  ["Simplicidade", " Interfaces claras e diretas."],
                  ["Confiança", " Desenvolvido pela VIXT."],
                  ["Acessibilidade", " Sem barreiras de entrada."],
                  ["Evolução", " Melhorias constantes."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <h3 className="font-extrabold text-[#0b1220]">{title}</h3>
                    <p className="mt-1 text-sm text-[#64748b]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#e2e8f0] bg-white py-20" id="faq">
        <div className="vixt-container max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-[#0b1220]">
            Perguntas frequentes
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.length > 0 ? (
              faqs.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-xl border border-[#e2e8f0] p-5"
                >
                  <summary className="cursor-pointer font-bold text-[#0b1220]">
                    {f.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#64748b]">{f.answer}</p>
                </details>
              ))
            ) : (
              <>
                <details className="rounded-xl border border-[#e2e8f0] p-5">
                  <summary className="cursor-pointer font-bold text-[#0b1220]">
                    A VIXT cobra algo pelos aplicativos?
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#64748b]">
                    Não. Nesta primeira versão, todos os aplicativos são
                    gratuitos, sem assinatura e sem cobrança.
                  </p>
                </details>
                <details className="rounded-xl border border-[#e2e8f0] p-5">
                  <summary className="cursor-pointer font-bold text-[#0b1220]">
                    Preciso criar uma conta para baixar?
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[#64748b]">
                    Não. Você pode navegar pelo catálogo e acessar os links de
                    acesso sem cadastro ou login.
                  </p>
                </details>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="vixt-container py-20">
        <div className="vixt-gradient relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white">
          <div className="vixt-grid-bg absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Pronto para conhecer a VIXT?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Explore o catálogo e encontre soluções que simplificam o seu dia a
              dia — gratuitamente.
            </p>
            <ButtonLink
              href="/aplicativos"
              size="lg"
              className="mt-8 bg-white !text-[#1d4ed8] hover:bg-[#eff6ff]"
            >
              Ver aplicativos <ArrowRight size={18} />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

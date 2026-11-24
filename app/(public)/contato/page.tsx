import type { Metadata } from "next";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { contentService } from "@/modules/content";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contato e suporte",
  description: "Canais de atendimento e informações de suporte da VIXT.",
};

export default async function ContactPage() {
  const faqs = await safePublicQuery(() => contentService.listFaqs(), []);
  return (
    <div className="vixt-container py-14">
      <p className="text-sm font-bold tracking-wider text-[#2563eb] uppercase">Ajuda</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0b1220]">
        Contato e suporte
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#475569]">
        Encontre informações sobre os aplicativos VIXT e os canais de atendimento
        disponíveis. A abertura de chamados será habilitada em uma versão futura;
        nesta primeira versão você pode consultar as perguntas frequentes e os
        canais abaixo.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="vixt-card p-7">
          <Mail className="text-[#2563eb]" size={26} />
          <h2 className="mt-4 text-xl font-extrabold text-[#0b1220]">E-mail</h2>
          <p className="mt-2 text-sm text-[#64748b]">
            Configure o e-mail de contato no painel administrativo para exibir este canal.
          </p>
        </div>
        <div className="vixt-card p-7">
          <MessageCircle className="text-[#2563eb]" size={26} />
          <h2 className="mt-4 text-xl font-extrabold text-[#0b1220]">Perguntas frequentes</h2>
          <p className="mt-2 text-sm text-[#64748b]">
            Consulte as respostas abaixo para dúvidas comuns sobre o ecossistema.
          </p>
        </div>
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-black text-[#0b1220]">Dúvidas comuns</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="rounded-xl border border-[#e2e8f0] bg-white p-5">
              <summary className="cursor-pointer font-bold text-[#0b1220]">{f.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#64748b]">{f.answer}</p>
            </details>
          ))}
          {!faqs.length && <p className="text-sm text-[#64748b]">Nenhuma FAQ cadastrada.</p>}
        </div>
      </section>

      <section id="privacidade" className="mt-14 max-w-3xl scroll-mt-24 rounded-2xl border border-[#e2e8f0] bg-white p-7">
        <ShieldCheck className="text-[#2563eb]" size={26} />
        <h2 className="mt-4 text-xl font-extrabold text-[#0b1220]">Privacidade (LGPD)</h2>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">
          O catálogo VIXT não exige login e não coleta informações pessoais para
          navegação ou download. Estatísticas são registradas de forma agregada,
          sem IP bruto ou identificação pessoal.
        </p>
      </section>
      <section id="termos" className="mt-6 max-w-3xl scroll-mt-24 rounded-2xl border border-[#e2e8f0] bg-white p-7">
        <h2 className="text-xl font-extrabold text-[#0b1220]">Termos de uso</h2>
        <p className="mt-2 text-sm leading-6 text-[#64748b]">
          Os aplicativos do catálogo são disponibilizados gratuitamente pela VIXT
          nesta primeira versão, sem assinatura ou cobrança. Cada aplicativo
          possui suas próprias condições de uso, descritas em sua página.
        </p>
      </section>
    </div>
  );
}

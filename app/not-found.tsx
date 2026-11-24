import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-5 text-center">
      <div>
        <p className="text-8xl font-black vixt-gradient-text">404</p>
        <h1 className="mt-4 text-2xl font-black text-[#0b1220]">Página não encontrada</h1>
        <p className="mt-3 text-[#64748b]">
          O conteúdo que você procura não está disponível.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Voltar ao início</ButtonLink>
          <ButtonLink href="/aplicativos" variant="outline">Ver aplicativos</ButtonLink>
        </div>
      </div>
    </main>
  );
}

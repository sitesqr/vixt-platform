import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui/logo";

export const metadata = { title: "Acesso administrativo" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-[#0b1220] px-5 py-12">
      <div className="absolute inset-0 vixt-grid-bg opacity-20" aria-hidden="true" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo inverse />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          <h1 className="text-2xl font-black tracking-tight text-[#0b1220]">
            Área administrativa
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Acesso restrito à equipe VIXT.
          </p>
          <LoginForm next={next ?? "/admin"} />
        </div>
        <p className="mt-6 text-center text-xs text-white/40">
          Este acesso é exclusivo da administração da VIXT.
        </p>
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Content {
  key: string;
  title: string | null;
  value: string;
  isDefault: boolean;
}

export function ContentEditor({
  contents,
  faqs,
}: {
  contents: Content[];
  faqs: { id: string; question: string; answer: string }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(contents[0]?.key ?? "");
  const [title, setTitle] = useState(contents[0]?.title ?? "");
  const [value, setValue] = useState(contents[0]?.value ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function choose(key: string) {
    const item = contents.find((c) => c.key === key);
    if (!item) return;
    setSelected(key);
    setTitle(item.title ?? "");
    setValue(item.value);
    setMessage(null);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/content/${encodeURIComponent(selected)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || null, value }),
      });
      const json = await response.json();
      setMessage(response.ok && json.ok ? "Conteúdo salvo." : "Erro ao salvar.");
      if (response.ok) router.refresh();
    } catch {
      setMessage("Erro de conexão.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight text-[#0b1220]">Conteúdo institucional</h2>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-3">
          <p className="px-2 py-2 text-xs font-bold uppercase text-[#94a3b8]">Textos editáveis</p>
          {contents.length ? (
            <div className="space-y-1">
              {contents.map((c) => (
                <button
                  key={c.key}
                  onClick={() => choose(c.key)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    selected === c.key ? "bg-[#eff6ff] text-[#1d4ed8]" : "text-[#475569] hover:bg-[#f8fafc]"
                  }`}
                >
                  {c.title || c.key}
                  {c.isDefault && <span className="ml-2 text-[10px] text-[#94a3b8]">padrão</span>}
                </button>
              ))}
            </div>
          ) : (
            <p className="p-3 text-sm text-[#94a3b8]">Execute o seed para popular os textos.</p>
          )}
        </div>

        <form onSubmit={save} className="space-y-5 rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <div>
            <p className="text-xs font-mono text-[#94a3b8]">{selected || "Nenhum texto selecionado"}</p>
            {contents.find((c) => c.key === selected)?.isDefault && (
              <Badge tone="amber" className="mt-2">Texto padrão — ainda não editado</Badge>
            )}
          </div>
          <Field label="Título">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Conteúdo">
            <textarea
              rows={6}
              className="w-full rounded-xl border border-[#cbd5e1] p-4 text-sm"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Field>
          {message && <p className="text-sm font-medium text-[#2563eb]">{message}</p>}
          <Button type="submit" disabled={!selected || busy}>
            <Save size={17} /> Salvar conteúdo
          </Button>
        </form>
      </div>

      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
        <h3 className="font-extrabold text-[#0b1220]">Perguntas frequentes ({faqs.length})</h3>
        <ul className="mt-4 space-y-3">
          {faqs.map((f) => (
            <li key={f.id} className="rounded-xl bg-[#f8fafc] p-4">
              <p className="font-semibold text-[#1e293b]">{f.question}</p>
              <p className="mt-1 text-sm text-[#64748b]">{f.answer}</p>
            </li>
          ))}
          {!faqs.length && <li className="text-sm text-[#94a3b8]">Nenhuma FAQ cadastrada.</li>}
        </ul>
      </section>
    </div>
  );
}

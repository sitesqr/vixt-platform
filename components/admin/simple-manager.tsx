"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

interface Item {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
}

export function SimpleManager({
  title,
  endpoint,
  initialItems,
  fields,
}: {
  title: string;
  endpoint: string;
  initialItems: Item[];
  fields: { name: string; label: string; required?: boolean }[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (!response.ok || !json.ok) {
        setError(json?.error?.message ?? "Erro ao salvar.");
        return;
      }
      setValues({});
      router.refresh();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir este item?")) return;
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (response.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } else setError("Erro ao excluir. Verifique relacionamentos.");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight text-[#0b1220]">{title}</h2>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={create} className="grid gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.name} label={f.label}>
            <Input
              required={f.required}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          </Field>
        ))}
        <div className="flex items-end sm:col-span-2">
          <Button type="submit" disabled={busy}><Plus size={17} /> Adicionar</Button>
        </div>
      </form>
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
        {items.length ? (
          <ul className="divide-y divide-[#e2e8f0]">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1">
                  <p className="font-bold text-[#0b1220]">{item.title}</p>
                  {item.subtitle && <p className="text-sm text-[#64748b]">{item.subtitle}</p>}
                  {item.meta && <p className="text-xs text-[#94a3b8]">{item.meta}</p>}
                </div>
                <button onClick={() => remove(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Excluir">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-sm text-[#94a3b8]">Nenhum item cadastrado.</p>
        )}
      </div>
    </div>
  );
}

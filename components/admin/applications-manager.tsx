"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ExternalLink, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AppRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  status: string;
  published: boolean;
  featured: boolean;
  category: { name: string } | null;
  iconUrl: string | null;
}

const statusLabel: Record<string, string> = {
  DEVELOPMENT: "Em desenvolvimento",
  TESTING: "Em testes",
  AVAILABLE: "Disponível",
  MAINTENANCE: "Em manutenção",
  DISCONTINUED: "Descontinuado",
};

const emptyForm = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  pwaUrl: "",
  categoryId: "",
  status: "DEVELOPMENT",
  featured: false,
};

export function ApplicationsManager({
  initialApps,
  categories,
}: {
  initialApps: AppRow[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [apps] = useState(initialApps);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setShowForm(true);
  }

  function openEdit(app: AppRow) {
    setForm({
      slug: app.slug,
      name: app.name,
      tagline: app.tagline,
      description: "",
      pwaUrl: "",
      categoryId: "",
      status: app.status,
      featured: app.featured,
    });
    setEditingId(app.id);
    setError(null);
    setShowForm(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        slug: form.slug,
        name: form.name,
        tagline: form.tagline,
        status: form.status,
        featured: form.featured,
      };
      if (form.description) payload.description = form.description;
      if (form.pwaUrl) payload.pwaUrl = form.pwaUrl;
      if (form.categoryId) payload.categoryId = form.categoryId;

      const response = await fetch(
        editingId ? `/api/admin/applications/${editingId}` : "/api/admin/applications",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await response.json();
      if (!response.ok || !json.ok) {
        setError(json?.error?.message ?? "Erro ao salvar.");
        return;
      }
      setShowForm(false);
      router.refresh();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setBusy(false);
    }
  }

  async function publish(id: string) {
    const response = await fetch(`/api/admin/applications/${id}/publish`, {
      method: "POST",
    });
    const json = await response.json();
    if (!response.ok || !json.ok) {
      setError(json?.error?.message ?? "Erro ao publicar.");
      return;
    }
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este aplicativo? Esta ação não pode ser desfeita.")) return;
    const response = await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
    else setError("Erro ao excluir.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#0b1220]">Aplicativos</h2>
          <p className="mt-1 text-sm text-[#64748b]">
            {apps.length} aplicativo(s) cadastrado(s).
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={17} /> Novo aplicativo
        </Button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={save} className="grid gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6 sm:grid-cols-2">
          <Field label="Slug" hint="Ex.: oficina, lava-rapido">
            <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Nome">
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Frase de destaque">
            <Input required value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </Field>
          <Field label="Categoria">
            <select
              className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Nenhuma</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Descrição completa">
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="URL da PWA (celular)" hint="Deixe vazio para não exibir botão de download">
            <Input
              value={form.pwaUrl}
              onChange={(e) => setForm({ ...form, pwaUrl: e.target.value })}
              placeholder="https://app.vixt.com.br"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-[#1e293b]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Destacar na página inicial
          </label>
          <div className="flex items-end gap-2 sm:col-span-2">
            <Button type="submit" disabled={busy}>Salvar</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              <X size={16} /> Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs uppercase text-[#64748b]">
            <tr>
              <th className="px-5 py-3">Aplicativo</th>
              <th className="px-5 py-3">Categoria</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Publicado</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {apps.map((app) => (
              <tr key={app.id}>
                <td className="px-5 py-4">
                  <p className="font-bold text-[#0b1220]">{app.name}</p>
                  <p className="text-xs text-[#94a3b8]">/{app.slug}</p>
                </td>
                <td className="px-5 py-4 text-[#64748b]">{app.category?.name ?? "—"}</td>
                <td className="px-5 py-4">
                  <Badge tone={app.status === "AVAILABLE" ? "green" : "gray"}>
                    {statusLabel[app.status] ?? app.status}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  {app.published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a]">
                      <Check size={14} /> Sim
                    </span>
                  ) : (
                    <span className="text-xs text-[#94a3b8]">Não</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(app)} className="rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]" title="Editar">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => publish(app.id)}
                      disabled={app.published}
                      className="rounded-lg p-2 text-[#16a34a] hover:bg-[#ecfdf5] disabled:opacity-30"
                      title="Publicar"
                    >
                      <Check size={16} />
                    </button>
                    <a href={`/aplicativos/${app.slug}`} className="rounded-lg p-2 text-[#2563eb] hover:bg-[#eff6ff]" title="Ver no portal">
                      <ExternalLink size={16} />
                    </a>
                    <button onClick={() => remove(app.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {apps.length === 0 && (
          <p className="p-8 text-center text-sm text-[#94a3b8]">
            Nenhum aplicativo cadastrado. Use “Novo aplicativo” para começar.
          </p>
        )}
      </div>
    </div>
  );
}

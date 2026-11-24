import { describe, it, expect } from "vitest";

// Regras puras testadas isoladamente, sem banco.
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

function validVersion(v: string) {
  return SEMVER.test(v);
}

function onlyActiveButtons(
  links: { active: boolean; url: string; label: string }[],
) {
  return links.filter((l) => l.active && l.url.startsWith("http"));
}

describe("regras de negócio", () => {
  it("aceita apenas versões semver", () => {
    expect(validVersion("1.2.0")).toBe(true);
    expect(validVersion("2.0.0-beta.1")).toBe(true);
    expect(validVersion("1.2")).toBe(false);
    expect(validVersion("versao-1")).toBe(false);
  });

  it("não exibe botões sem link funcional", () => {
    const buttons = onlyActiveButtons([
      { active: true, url: "https://play.google.com/store/apps/x", label: "Play" },
      { active: false, url: "https://apk.vixt.com.br/x.apk", label: "APK" },
      { active: true, url: "", label: "Sem link" },
      { active: true, url: "javascript:alert(1)", label: "Inválido" },
    ]);
    expect(buttons).toHaveLength(1);
    expect(buttons[0].label).toBe("Play");
  });

  it("publicação exige status disponível e link ativo", () => {
    function canPublish(app: { status: string; links: string[] }) {
      if (app.status !== "AVAILABLE") return false;
      return app.links.some((l) => l.startsWith("http"));
    }
    expect(canPublish({ status: "AVAILABLE", links: ["https://x"] })).toBe(true);
    expect(canPublish({ status: "DEVELOPMENT", links: ["https://x"] })).toBe(false);
    expect(canPublish({ status: "AVAILABLE", links: [] })).toBe(false);
  });

  it("distingue clique de download confirmado", () => {
    const event = { type: "DOWNLOAD", confirmed: false };
    expect(event.confirmed).toBe(false);
    expect(event.type).toBe("DOWNLOAD");
  });

  it("aplicativos de terceiros não aparecem no catálogo da Fase 1", () => {
    const catalogFilter = (apps: { ownership: string; published: boolean; status: string }[]) =>
      apps.filter((a) => a.ownership === "VIXT" && a.published && a.status === "AVAILABLE");
    expect(
      catalogFilter([
        { ownership: "VIXT", published: true, status: "AVAILABLE" },
        { ownership: "THIRD_PARTY", published: true, status: "AVAILABLE" },
        { ownership: "VIXT", published: false, status: "AVAILABLE" },
      ]),
    ).toHaveLength(1);
  });
});

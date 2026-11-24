import { describe, it, expect } from "vitest";
import { groupDistributions } from "@/modules/applications/service";
import type { DistributionButton } from "@/modules/applications";

function button(overrides: Partial<DistributionButton>): DistributionButton {
  return {
    id: Math.random().toString(36).slice(2),
    label: "Link",
    type: "DESKTOP",
    platform: "WINDOWS",
    availability: "AVAILABLE",
    url: "https://cdn.vixt.com.br/app.exe",
    fileName: null,
    fileSizeBytes: null,
    checksumSha256: null,
    notes: null,
    trackDownload: true,
    ...overrides,
  };
}

describe("agrupamento de distribuições", () => {
  it("separa Web, Desktop e Mobile", () => {
    const groups = groupDistributions([
      button({ platform: "WEB", type: "WEB", url: "https://app.vixt.com.br" }),
      button({ platform: "WINDOWS" }),
      button({ platform: "ANDROID", type: "APK" }),
    ]);
    expect(groups.web).toHaveLength(1);
    expect(groups.desktop).toHaveLength(1);
    expect(groups.mobile).toHaveLength(1);
    expect(groups.comingSoon).toHaveLength(0);
  });

  it("nunca expõe URL de item 'Em breve' e o marca como próxima versão", () => {
    const groups = groupDistributions([
      button({
        platform: "ANDROID",
        availability: "COMING_SOON",
        url: null,
        label: "Android — Em breve",
      }),
    ]);
    expect(groups.mobile).toHaveLength(0);
    expect(groups.comingSoon).toContain("ANDROID");
  });

  it("ignora links sem URL mesmo que estejam ativos", () => {
    const groups = groupDistributions([
      button({ platform: "WINDOWS", url: null }),
      button({ platform: "WEB", url: "", type: "WEB" }),
    ]);
    expect(groups.desktop).toHaveLength(0);
    expect(groups.web).toHaveLength(0);
  });

  it("aceita macOS e Linux no grupo Desktop", () => {
    const groups = groupDistributions([
      button({ platform: "MACOS" }),
      button({ platform: "LINUX" }),
    ]);
    expect(groups.desktop).toHaveLength(2);
  });
});

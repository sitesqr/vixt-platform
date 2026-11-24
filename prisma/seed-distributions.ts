/**
 * Seed OPCIONAL de distribuições Desktop/Android.
 *
 * NÃO cria links fictícios. Só registra o que foi realmente construído e
 * hospedado, conforme variáveis de ambiente preenchidas:
 *
 *   LINK_OFICINA_WINDOWS=https://.../vixt-oficina-1.0.0-setup.exe
 *   LINK_OFICINA_WINDOWS_SHA256=<hash sha256 de 64 hex>
 *   LINK_OFICINA_WINDOWS_SIZE=<bytes>
 *   LINK_OFICINA_ANDROID=https://.../vixt-oficina-1.0.0.apk   (futuro)
 *   ANNOUNCE_ANDROID_COMING_SOON=true   (anuncia "Android — Em breve" sem link)
 *
 * Uso: npm run db:seed:distributions
 */
import { PrismaClient, DistributionType } from "@prisma/client";

const prisma = new PrismaClient();

const apps = [
  { slug: "oficina", label: "VIXT Oficina" },
  { slug: "barbearia", label: "VIXT Barbearia" },
];

function env(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
}

async function register(input: {
  applicationId: string;
  type: DistributionType;
  platform: "WINDOWS" | "ANDROID";
  label: string;
  url?: string;
  fileName?: string;
  sha?: string;
  size?: string;
}) {
  const hasUrl = Boolean(input.url?.startsWith("http"));
  const shaValid = Boolean(input.sha && /^[a-f0-9]{64}$/i.test(input.sha));

  // Segurança: instalador sem URL ou sem SHA-256 válido NÃO é cadastrado.
  if (!hasUrl || !shaValid) {
    console.log(
      `⏭  ${input.platform} de ${input.label}: ignorado (URL ausente ou SHA-256 inválido).`,
    );
    return;
  }

  const existing = await prisma.distribution.findFirst({
    where: {
      applicationId: input.applicationId,
      platform: input.platform,
      url: input.url,
    },
  });
  if (existing) {
    console.log(`ℹ️  ${input.platform} de ${input.label}: já cadastrado.`);
    return;
  }

  await prisma.distribution.create({
    data: {
      applicationId: input.applicationId,
      type: input.type,
      platform: input.platform,
      availability: "AVAILABLE",
      label: input.label,
      url: input.url!,
      fileName: input.fileName,
      checksumSha256: input.sha!.toLowerCase(),
      fileSizeBytes: input.size ? BigInt(input.size) : null,
      trackDownload: true,
      sortOrder: 10,
    },
  });
  console.log(`✅ ${input.platform} de ${input.label}: cadastrado.`);
}

async function announceAndroid(applicationId: string, label: string) {
  const existing = await prisma.distribution.findFirst({
    where: { applicationId, platform: "ANDROID", availability: "COMING_SOON" },
  });
  if (existing) return;
  await prisma.distribution.create({
    data: {
      applicationId,
      type: "APK",
      platform: "ANDROID",
      availability: "COMING_SOON",
      label: "Android — Em breve",
      url: "",
      active: true,
      trackDownload: false,
      sortOrder: 20,
    },
  });
  console.log(`📱 Android de ${label}: anunciado como "Em breve" (sem link).`);
}

async function main() {
  console.log("🌱 Seed de distribuições — apenas links reais e verificados.\n");

  const announce = env("ANNOUNCE_ANDROID_COMING_SOON") === "true";

  for (const app of apps) {
    const row = await prisma.application.findUnique({
      where: { slug: app.slug },
      select: { id: true },
    });
    if (!row) {
      console.log(`⏭  ${app.label}: aplicativo não encontrado.`);
      continue;
    }

    const prefix = app.slug.toUpperCase();
    await register({
      applicationId: row.id,
      type: "DESKTOP",
      platform: "WINDOWS",
      label: "Baixar para Windows",
      url: env(`LINK_${prefix}_WINDOWS`),
      fileName: env(`LINK_${prefix}_WINDOWS`)?.split("/").pop(),
      sha: env(`LINK_${prefix}_WINDOWS_SHA256`),
      size: env(`LINK_${prefix}_WINDOWS_SIZE`),
    });

    await register({
      applicationId: row.id,
      type: "APK",
      platform: "ANDROID",
      label: "Baixar para Android",
      url: env(`LINK_${prefix}_ANDROID`),
      fileName: env(`LINK_${prefix}_ANDROID`)?.split("/").pop(),
      sha: env(`LINK_${prefix}_ANDROID_SHA256`),
      size: env(`LINK_${prefix}_ANDROID_SIZE`),
    });

    if (announce) await announceAndroid(row.id, app.label);
  }

  console.log("\n✅ Concluído. Nenhum link foi inventado.");
}

main()
  .catch((error) => {
    console.error("❌ Falha:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/**
 * Seed idempotente da VIXT Central.
 *
 * IMPORTANTE: os aplicativos abaixo são as informações públicas reais dos
 * produtos own da VIXT. Nenhum código/banco desses aplicativos é tocado.
 * Links de distribuição só são criados se a variável de ambiente
 * correspondente estiver definida — nunca inventamos URLs.
 */
import { PrismaClient, AppStatus, DistributionType } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME?.trim() || "Administrador VIXT";

// Aplicativos mantidos no catálogo mas ainda não disponíveis ao público.
// O seed nunca republica estes slugs — a publicação é feita pelo painel admin.
const DEFERRED_SLUGS = new Set(["borracharia", "lava-rapido", "salao"]);

const apps = [
  {
    slug: "oficina",
    name: "VIXT Oficina",
    tagline: "Sistema para gestão de oficinas mecânicas.",
    description:
      "O VIXT Oficina é uma solução para organizar a rotina de oficinas mecânicas: clientes, veículos, ordens de serviço e agendamentos em um só lugar.",
    objective: "Organizar e agilizar a gestão dia a dia de oficinas mecânicas.",
    targetAudience: "Oficinas mecânicas, mecânicos e gestores do segmento automotivo.",
    advantages: [
      "Centralização das informações da oficina",
      "Acesso pelo navegador, sem instalação",
      "Desenvolvido pela VIXT",
    ],
    platforms: ["Web"],
    accentColor: "#2563eb",
    distributionEnv: "LINK_OFICINA_WEB",
    distributionType: DistributionType.WEB,
    pwaEnv: "PWA_OFICINA_URL",
  },
  {
    slug: "barbearia",
    name: "VIXT Barbearia",
    tagline: "Sistema para gestão de barbearias.",
    description:
      "O VIXT Barbearia auxilia na organização de agendamentos, clientes e atendimentos de barbearias e espaços de cuidado masculino.",
    objective: "Simplificar a gestão de barbearias e o agendamento de clientes.",
    targetAudience: "Barbearias, barbeiros e profissionais de cuidado pessoal.",
    advantages: [
      "Agenda organizada em um só lugar",
      "Acesso pelo navegador",
      "Desenvolvido pela VIXT",
    ],
    platforms: ["Web"],
    accentColor: "#0f172a",
    distributionEnv: "LINK_BARBEARIA_WEB",
    distributionType: DistributionType.WEB,
    pwaEnv: "PWA_BARBEARIA_URL",
  },
  {
    slug: "borracharia",
    name: "VIXT Borracharia",
    tagline: "Sistema para gestão de borracharias.",
    description:
      "O VIXT Borracharia apoia a gestão de borracharias, com foco em serviços, clientes e organização das atividades diárias.",
    objective: "Facilitar a administração de borracharias e seus serviços.",
    targetAudience: "Borracharias e profissionais do segmento automotivo.",
    advantages: [
      "Gestão simplificada dos serviços",
      "Acesso pelo navegador",
      "Desenvolvido pela VIXT",
    ],
    platforms: ["Web"],
    accentColor: "#334155",
    distributionEnv: "LINK_BORRACHARIA_WEB",
    distributionType: DistributionType.WEB,
  },
  {
    slug: "salao",
    name: "VIXT Salão",
    tagline: "Sistema para gestão de salões de beleza.",
    description:
      "O VIXT Salão foi pensado para organizar a rotina de salões de beleza: agenda, clientes e atendimentos de forma simples.",
    objective: "Apoiar a gestão de salões de beleza e seus profissionais.",
    targetAudience: "Salões de beleza, cabeleireiros e profissionais de beleza.",
    advantages: [
      "Agenda e clientes organizados",
      "Acesso pelo navegador",
      "Desenvolvido pela VIXT",
    ],
    platforms: ["Web"],
    accentColor: "#db2777",
    distributionEnv: "LINK_SALAO_WEB",
    distributionType: DistributionType.WEB,
  },
  {
    slug: "lava-rapido",
    name: "VIXT Lava Rápido",
    tagline: "Sistema para gestão de lava-rápidos.",
    description:
      "O VIXT Lava Rápido ajuda a organizar serviços, clientes e o fluxo de atendimento de lava-rápidos.",
    objective: "Simplificar a operação e o atendimento de lava-rápidos.",
    targetAudience: "Lava-rápidos e profissionais de limpeza automotiva.",
    advantages: [
      "Fluxo de atendimento organizado",
      "Acesso pelo navegador",
      "Desenvolvido pela VIXT",
    ],
    platforms: ["Web"],
    accentColor: "#0891b2",
    distributionEnv: "LINK_LAVA_RAPIDO_WEB",
    distributionType: DistributionType.WEB,
  },
];

const categories = [
  {
    slug: "gestao-empresarial",
    name: "Gestão empresarial",
    description: "Soluções para administrar negócios e operações.",
    iconName: "BriefcaseBusiness",
    sortOrder: 1,
  },
  {
    slug: "automotivo",
    name: "Automotivo",
    description: "Aplicativos para oficinas, borracharias e lava-rápidos.",
    iconName: "CarFront",
    sortOrder: 2,
  },
  {
    slug: "beleza",
    name: "Beleza",
    description: "Soluções para barbearias e salões de beleza.",
    iconName: "Scissors",
    sortOrder: 3,
  },
  {
    slug: "servicos",
    name: "Serviços",
    description: "Ferramentas para negócios de prestação de serviços.",
    iconName: "Wrench",
    sortOrder: 4,
  },
  {
    slug: "produtividade",
    name: "Produtividade",
    description: "Aplicativos para organizar o dia a dia.",
    iconName: "Zap",
    sortOrder: 5,
  },
];

const faqs = [
  {
    question: "A VIXT cobra algo pelos aplicativos?",
    answer:
      "Não. Nesta primeira versão, todos os aplicativos desenvolvidos pela VIXT são gratuitos, sem assinatura e sem cobrança.",
    sortOrder: 1,
  },
  {
    question: "Preciso criar uma conta para baixar ou acessar?",
    answer:
      "Não. O catálogo é público e os links de distribuição podem ser acessados sem cadastro ou login.",
    sortOrder: 2,
  },
  {
    question: "Quem desenvolve os aplicativos do catálogo?",
    answer:
      "Nesta primeira versão, todos os aplicativos são desenvolvidos pela própria VIXT.",
    sortOrder: 3,
  },
];

const defaultContents = [
  {
    key: "public.hero.subtitle",
    title: "Subtítulo principal",
    value:
      "Um ecossistema de aplicativos gratuitos para pessoais, profissionais e empresas. Conheça, escolha e comece a usar sem cadastro.",
  },
];

async function main() {
  console.log("🌱 Iniciando seed da VIXT Central...");

  // Papéis e permissões
  const superAdmin = await prisma.adminRole.upsert({
    where: { name: "SUPER_ADMIN" },
    create: { name: "SUPER_ADMIN", description: "Acesso total à plataforma." },
    update: {},
  });
  await prisma.adminRole.upsert({
    where: { name: "ADMIN" },
    create: { name: "ADMIN", description: "Administração do catálogo e conteúdo." },
    update: {},
  });
  await prisma.adminRole.upsert({
    where: { name: "EDITOR" },
    create: { name: "EDITOR", description: "Edição de aplicativos e conteúdo." },
    update: {},
  });
  await prisma.adminRole.upsert({
    where: { name: "VIEWER" },
    create: { name: "VIEWER", description: "Somente leitura." },
    update: {},
  });

  const permissionKeys = [
    "applications.read",
    "applications.write",
    "categories.write",
    "content.write",
    "banners.write",
    "stats.read",
  ];
  for (const key of permissionKeys) {
    const permission = await prisma.permission.upsert({
      where: { key },
      create: { key },
      update: {},
    });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdmin.id, permissionId: permission.id } },
      create: { roleId: superAdmin.id, permissionId: permission.id },
      update: {},
    });
  }

  // Primeiro administrador — somente se credenciais forem fornecidas.
  if (adminEmail && adminPassword) {
    const existing = await prisma.admin.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.admin.create({
        data: {
          email: adminEmail,
          name: adminName,
          passwordHash: await hashPassword(adminPassword),
          roleId: superAdmin.id,
        },
      });
      console.log(`✅ Administrador criado: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Administrador já existe: ${adminEmail}`);
    }
  } else {
    console.log("ℹ️ ADMIN_EMAIL/ADMIN_PASSWORD não definidos — nenhum admin criado.");
  }

  // Categorias
  const categoryIds: Record<string, string> = {};
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
    });
    categoryIds[cat.slug] = row.id;
  }

  // Aplicativos — publicados somente se houver link real configurado.
  for (const app of apps) {
    const link = process.env[app.distributionEnv]?.trim();
    // Nunca publicar links locais em produção.
    const isLocal = Boolean(link && link.includes("localhost"));
    const validLink = Boolean(link && link.startsWith("http") && !isLocal);
    const published = validLink;
    const pwaEnvKey = "pwaEnv" in app && typeof app.pwaEnv === "string" ? app.pwaEnv : null;
    const pwa = pwaEnvKey ? process.env[pwaEnvKey]?.trim() : undefined;
    const validPwa = Boolean(pwa && pwa.startsWith("http") && !pwa.includes("localhost")) ? pwa : null;

    const row = await prisma.application.upsert({
      where: { slug: app.slug },
      create: {
        slug: app.slug,
        name: app.name,
        tagline: app.tagline,
        description: app.description,
        objective: app.objective,
        targetAudience: app.targetAudience,
        advantages: app.advantages,
        platforms: app.platforms,
        accentColor: app.accentColor,
        pwaUrl: validPwa,
        categoryId:
          categoryIds[
            app.slug === "oficina" || app.slug === "borracharia" || app.slug === "lava-rapido"
              ? "automotivo"
              : app.slug === "salao" || app.slug === "barbearia"
                ? "beleza"
                : "gestao-empresarial"
          ],
        status: published ? AppStatus.AVAILABLE : AppStatus.DEVELOPMENT,
        published,
        featured: published,
        releasedAt: published ? new Date() : null,
      },
      update: {
        name: app.name,
        tagline: app.tagline,
        description: app.description,
        objective: app.objective,
        targetAudience: app.targetAudience,
        advantages: app.advantages,
        platforms: app.platforms,
        accentColor: app.accentColor,
        pwaUrl: validPwa,
        // Respeita despublicações feitas pelo painel administrativo.
        ...(DEFERRED_SLUGS.has(app.slug)
          ? {}
          : {
              status: published ? AppStatus.AVAILABLE : AppStatus.DEVELOPMENT,
              published,
            }),
      },
    });

    if (validLink && link) {
      const existingLink = await prisma.distribution.findFirst({
        where: { applicationId: row.id, url: link },
      });
      if (!existingLink) {
        await prisma.distribution.create({
          data: {
            applicationId: row.id,
            type: app.distributionType,
            label: "Acessar versão web",
            url: link,
            active: true,
            sortOrder: 0,
          },
        });
      }
    }
  }

  // FAQ e conteúdo institucional
  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) await prisma.faq.create({ data: faq });
  }
  for (const content of defaultContents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      create: content,
      update: {},
    });
  }

  console.log("✅ Seed concluído.");
  if (!apps.some((a) => process.env[a.distributionEnv]?.startsWith("http"))) {
    console.log(
      "ℹ️ Nenhum LINK_*_WEB definido: aplicativos ficaram em desenvolvimento (não publicados).",
    );
  }
}

main()
  .catch((error) => {
    console.error("❌ Falha no seed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

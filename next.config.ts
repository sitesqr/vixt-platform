import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* VIXT: renderização dinâmica explícita por rota (banco de dados + sessões).
     Cache Components desabilitado para manter previsibilidade com Prisma e
     cookies; reavaliar quando houver camada de cache isolada.
     Ver ARCHITECTURE.md. */
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

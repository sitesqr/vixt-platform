// O wrapper Electron roda em Node CommonJS (main.js).
// A regra global do projeto Next/TypeScript não se aplica aqui.
const config = [
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default config;

/**
 * VIXT Desktop — wrapper Electron genérico.
 *
 * Um único binário por aplicativo. A configuração de cada app está em
 * desktop/apps/<slug>.config.json (URL de produção, nome, ícone e domínios
 * permitidos). O wrapper apenas exibe o aplicativo WEB já existente —
 * nenhum código ou banco dos aplicativos é alterado.
 */
const { app, BrowserWindow, shell, Menu, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const APP_SLUG = process.env.APP_SLUG || "oficina";
const configPath = path.join(
  __dirname,
  "..",
  "apps",
  `${APP_SLUG}.config.json`,
);

let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
} catch (error) {
  // Se não houver config, falha de forma explícita — nunca abre URL inventada.
  dialog.showErrorBox(
    "VIXT Desktop",
    `Configuração não encontrada para "${APP_SLUG}".\n${error.message}`,
  );
  app.quit();
}

const isMac = process.platform === "darwin";
let mainWindow;

function iconPath() {
  const candidate = path.join(__dirname, "..", "build", config.icon);
  return fs.existsSync(candidate) ? candidate : undefined;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: config.window?.width || 1280,
    height: config.window?.height || 820,
    minWidth: 900,
    minHeight: 600,
    title: config.windowTitle,
    icon: iconPath(),
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  // Janela independente, com ícone próprio na barra de tarefas.
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.setTitle(config.windowTitle);

  mainWindow.loadURL(config.startUrl);

  // Links externos abrem no navegador padrão, não dentro do app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowed(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!isAllowed(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    { role: "fileMenu" },
    { role: "editMenu" },
    { role: "viewMenu" },
    {
      label: "Ajuda",
      submenu: [
        {
          label: "Abrir central VIXT",
          click: () => shell.openExternal("https://vixt.com.br"),
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function isAllowed(url) {
  try {
    const parsed = new URL(url);
    return (config.allowedOrigins || []).some(
      (origin) => parsed.origin === new URL(origin).origin,
    );
  } catch {
    return false;
  }
}

app.whenReady().then(() => {
  createWindow();
  // Auto-update: estrutura pronta; ativar quando houver feed de releases.
  if (config.updateFeedUrl) {
    // require("electron-updater").autoUpdater.setFeedURL(config.updateFeedUrl);
    // Chamada intencionalmente comentada até existir release publicado.
    void config.updateFeedUrl;
  }
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

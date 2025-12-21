import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { isDev } from "./util.js";
import { initDatabase } from "./database.js";
import { setupAuthHandlers } from "./auth-handlers.js";
import { setupIngredientHandlers } from "./ingredient-handlers.js";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database and handlers
app.on("ready", () => {
  initDatabase();
  setupAuthHandlers();
  setupIngredientHandlers();

  const minWidth = 800;
  const minHeight = 600;

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth,
    minHeight,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on("will-resize", (event, newBounds) => {
    if (newBounds.width < minWidth || newBounds.height < minHeight) {
      event.preventDefault();
    }
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(
      path.join(app.getAppPath(), "dist-react", "index.html")
    );
  }
});

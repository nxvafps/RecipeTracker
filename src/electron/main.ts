import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";

app.on("ready", () => {
  const minWidth = 800;
  const minHeight = 600;

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth,
    minHeight,
    resizable: true,
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

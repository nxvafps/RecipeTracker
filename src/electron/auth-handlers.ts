import { ipcMain } from "electron";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  wipeDatabase,
} from "./database.js";
import { isDev } from "./util.js";

export function setupAuthHandlers() {
  // Register handler
  ipcMain.handle("auth:register", async (_event, username, password) => {
    return registerUser(username, password);
  });

  // Login handler
  ipcMain.handle("auth:login", async (_event, username, password) => {
    return loginUser(username, password);
  });

  // Logout handler
  ipcMain.handle("auth:logout", async () => {
    return logoutUser();
  });

  // Get current user handler
  ipcMain.handle("auth:getCurrentUser", async () => {
    return getCurrentUser();
  });

  // DevTools: Wipe database (only available in development)
  ipcMain.handle("devtools:wipeDatabase", async () => {
    if (!isDev()) {
      return {
        success: false,
        message: "DevTools are only available in development mode",
      };
    }
    return wipeDatabase();
  });

  // DevTools: Check if dev mode is enabled
  ipcMain.handle("devtools:isDev", async () => {
    return isDev();
  });
}

import { ipcMain } from "electron";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "./database.js";

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
}

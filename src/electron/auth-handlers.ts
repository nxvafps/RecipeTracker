import { ipcMain } from "electron";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  wipeDatabase,
  getDatabaseStats,
  seedDatabase,
  exportDatabaseData,
  executeQuery,
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

  // DevTools: Get database stats
  ipcMain.handle("devtools:getDatabaseStats", async () => {
    if (!isDev()) {
      return {
        success: false,
        message: "DevTools are only available in development mode",
      };
    }
    return getDatabaseStats();
  });

  // DevTools: Seed database with sample data
  ipcMain.handle("devtools:seedDatabase", async () => {
    if (!isDev()) {
      return {
        success: false,
        message: "DevTools are only available in development mode",
      };
    }
    return seedDatabase();
  });

  // DevTools: Export database data
  ipcMain.handle("devtools:exportDatabase", async () => {
    if (!isDev()) {
      return {
        success: false,
        message: "DevTools are only available in development mode",
      };
    }
    return exportDatabaseData();
  });

  // DevTools: Execute SQL query
  ipcMain.handle("devtools:executeQuery", async (_event, query: string) => {
    if (!isDev()) {
      return {
        success: false,
        message: "DevTools are only available in development mode",
      };
    }
    return executeQuery(query);
  });
}

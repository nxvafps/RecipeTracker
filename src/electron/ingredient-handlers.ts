import { ipcMain } from "electron";
import {
  addIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
  getCurrentUser,
} from "./database.js";

export function setupIngredientHandlers() {
  // Add ingredient
  ipcMain.handle(
    "ingredients:add",
    async (_event, name: string, unit: string) => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      return addIngredient(name, unit, currentUser.id);
    }
  );

  // Get all ingredients
  ipcMain.handle("ingredients:getAll", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return getIngredients(currentUser.id);
  });

  // Update ingredient
  ipcMain.handle(
    "ingredients:update",
    async (_event, id: number, name: string, unit: string) => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      return updateIngredient(id, name, unit, currentUser.id);
    }
  );

  // Delete ingredient
  ipcMain.handle("ingredients:delete", async (_event, id: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return deleteIngredient(id, currentUser.id);
  });
}

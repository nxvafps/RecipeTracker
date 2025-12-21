import { ipcMain } from "electron";
import {
  addRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getCurrentUser,
  RecipeInput,
} from "./database.js";

export function setupRecipeHandlers() {
  // Add recipe
  ipcMain.handle("recipes:add", async (_event, input: RecipeInput) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return addRecipe(input, currentUser.id);
  });

  // Get all recipes
  ipcMain.handle("recipes:getAll", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return getRecipes(currentUser.id);
  });

  // Get recipe by ID
  ipcMain.handle("recipes:getById", async (_event, id: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return getRecipeById(id, currentUser.id);
  });

  // Update recipe
  ipcMain.handle(
    "recipes:update",
    async (_event, id: number, input: RecipeInput) => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      return updateRecipe(id, input, currentUser.id);
    }
  );

  // Delete recipe
  ipcMain.handle("recipes:delete", async (_event, id: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return deleteRecipe(id, currentUser.id);
  });
}

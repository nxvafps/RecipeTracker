import { ipcMain, dialog, app } from "electron";
import {
  addRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getCurrentUser,
  getIngredients,
  addIngredient,
} from "./database.js";
import type { RecipeInput } from "./database.js";
import fs from "fs";
import path from "path";

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

  // Export recipes
  ipcMain.handle("recipes:export", async (_event, recipeIds: number[]) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    try {
      // Fetch all selected recipes with full details
      const recipes = [];
      for (const id of recipeIds) {
        const result = getRecipeById(id, currentUser.id);
        if (result.success && result.recipe) {
          recipes.push(result.recipe);
        }
      }

      if (recipes.length === 0) {
        return {
          success: false,
          message: "No recipes found to export",
        };
      }

      // Create export data structure
      const exportData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        recipes: recipes.map((recipe) => ({
          name: recipe.name,
          servings: recipe.servings,
          time_needed: recipe.time_needed,
          ingredients: recipe.ingredients.map((ing) => ({
            name: ing.ingredient_name,
            unit: ing.ingredient_unit,
            quantity: ing.quantity,
          })),
          instructions: recipe.instructions
            .sort((a, b) => a.step_number - b.step_number)
            .map((inst) => inst.instruction),
        })),
      };

      // Create filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .split("T")[0];
      const filename = `recipes-export-${timestamp}.json`;

      // Get downloads folder path
      const downloadsPath = app.getPath("downloads");
      const filepath = path.join(downloadsPath, filename);

      // Write file
      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2), "utf-8");

      return {
        success: true,
        message: `Successfully exported ${recipes.length} recipe(s)`,
        filepath: filepath,
        filename: filename,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to export recipes: " + error.message,
      };
    }
  });

  // Import recipes
  ipcMain.handle("recipes:import", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    try {
      // Show file picker dialog
      const result = await dialog.showOpenDialog({
        title: "Import Recipes",
        properties: ["openFile"],
        filters: [
          { name: "JSON Files", extensions: ["json"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return {
          success: false,
          message: "Import cancelled",
        };
      }

      const filepath = result.filePaths[0];

      // Read and parse file
      const fileContent = fs.readFileSync(filepath, "utf-8");
      const importData = JSON.parse(fileContent);

      // Validate import data structure
      if (!importData.recipes || !Array.isArray(importData.recipes)) {
        return {
          success: false,
          message: "Invalid import file format",
        };
      }

      // Import recipes
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (const recipeData of importData.recipes) {
        try {
          // Map ingredients - find existing or create new ones
          const ingredientMappings: Array<{
            ingredientId: number;
            quantity: string;
          }> = [];

          for (const ing of recipeData.ingredients) {
            // Try to find existing ingredient
            const existingIngs = getIngredients(currentUser.id);
            let ingredientId: number | null = null;

            if (existingIngs.success && existingIngs.ingredients) {
              const existing = existingIngs.ingredients.find(
                (i) =>
                  i.name.toLowerCase() === ing.name.toLowerCase() &&
                  i.unit.toLowerCase() === ing.unit.toLowerCase()
              );
              if (existing) {
                ingredientId = existing.id;
              }
            }

            // Create new ingredient if not found
            if (!ingredientId) {
              const newIng = addIngredient(ing.name, ing.unit, currentUser.id);
              if (newIng.success && newIng.ingredient) {
                ingredientId = newIng.ingredient.id;
              }
            }

            if (ingredientId) {
              ingredientMappings.push({
                ingredientId: ingredientId,
                quantity: ing.quantity,
              });
            }
          }

          // Create recipe input
          const recipeInput: RecipeInput = {
            name: recipeData.name,
            servings: recipeData.servings,
            timeNeeded: recipeData.time_needed,
            ingredients: ingredientMappings,
            instructions: recipeData.instructions,
          };

          // Add recipe
          const addResult = addRecipe(recipeInput, currentUser.id);
          if (addResult.success) {
            successCount++;
          } else {
            failCount++;
            errors.push(`${recipeData.name}: ${addResult.message}`);
          }
        } catch (error: any) {
          failCount++;
          errors.push(`${recipeData.name}: ${error.message}`);
        }
      }

      return {
        success: successCount > 0,
        message:
          successCount > 0
            ? `Successfully imported ${successCount} recipe(s)${
                failCount > 0 ? `, ${failCount} failed` : ""
              }`
            : `Failed to import recipes${
                errors.length > 0 ? ": " + errors.join(", ") : ""
              }`,
        imported: successCount,
        failed: failCount,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to import recipes: " + error.message,
      };
    }
  });
}

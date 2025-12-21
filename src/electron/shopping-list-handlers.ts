import { ipcMain } from "electron";
import {
  addToShoppingList,
  getShoppingList,
  updateShoppingListItem,
  deleteShoppingListItem,
  clearShoppingList,
  getCurrentUser,
  ShoppingListItemInput,
} from "./database.js";

export function setupShoppingListHandlers() {
  // Add items to shopping list
  ipcMain.handle(
    "shoppingList:addItems",
    async (_event, items: ShoppingListItemInput[]) => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      return addToShoppingList(items, currentUser.id);
    }
  );

  // Get all shopping list items
  ipcMain.handle("shoppingList:getAll", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return getShoppingList(currentUser.id);
  });

  // Update shopping list item
  ipcMain.handle(
    "shoppingList:update",
    async (_event, id: number, quantity: string) => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: "User not authenticated",
        };
      }

      return updateShoppingListItem(id, quantity, currentUser.id);
    }
  );

  // Delete shopping list item
  ipcMain.handle("shoppingList:delete", async (_event, id: number) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return deleteShoppingListItem(id, currentUser.id);
  });

  // Clear shopping list
  ipcMain.handle("shoppingList:clear", async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    return clearShoppingList(currentUser.id);
  });
}

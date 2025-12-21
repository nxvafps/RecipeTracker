const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Auth methods
  auth: {
    register: (username: string, password: string) =>
      ipcRenderer.invoke("auth:register", username, password),
    login: (username: string, password: string) =>
      ipcRenderer.invoke("auth:login", username, password),
    logout: () => ipcRenderer.invoke("auth:logout"),
    getCurrentUser: () => ipcRenderer.invoke("auth:getCurrentUser"),
  },
  // Ingredients methods
  ingredients: {
    add: (name: string, unit: string) =>
      ipcRenderer.invoke("ingredients:add", name, unit),
    getAll: () => ipcRenderer.invoke("ingredients:getAll"),
    update: (id: number, name: string, unit: string) =>
      ipcRenderer.invoke("ingredients:update", id, name, unit),
    delete: (id: number) => ipcRenderer.invoke("ingredients:delete", id),
  },
  // Recipes methods
  recipes: {
    add: (input: any) => ipcRenderer.invoke("recipes:add", input),
    getAll: () => ipcRenderer.invoke("recipes:getAll"),
    getById: (id: number) => ipcRenderer.invoke("recipes:getById", id),
    update: (id: number, input: any) =>
      ipcRenderer.invoke("recipes:update", id, input),
    delete: (id: number) => ipcRenderer.invoke("recipes:delete", id),
  },
  // Shopping List methods
  shoppingList: {
    addItems: (items: any[]) =>
      ipcRenderer.invoke("shoppingList:addItems", items),
    getAll: () => ipcRenderer.invoke("shoppingList:getAll"),
    update: (id: number, quantity: string) =>
      ipcRenderer.invoke("shoppingList:update", id, quantity),
    delete: (id: number) => ipcRenderer.invoke("shoppingList:delete", id),
    clear: () => ipcRenderer.invoke("shoppingList:clear"),
  },
  // DevTools methods (only work in development mode)
  devtools: {
    wipeDatabase: () => ipcRenderer.invoke("devtools:wipeDatabase"),
    isDev: () => ipcRenderer.invoke("devtools:isDev"),
    getDatabaseStats: () => ipcRenderer.invoke("devtools:getDatabaseStats"),
    seedDatabase: () => ipcRenderer.invoke("devtools:seedDatabase"),
    exportDatabase: () => ipcRenderer.invoke("devtools:exportDatabase"),
    executeQuery: (query: string) =>
      ipcRenderer.invoke("devtools:executeQuery", query),
  },
});

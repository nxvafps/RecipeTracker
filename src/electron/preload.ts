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
  // DevTools methods (only work in development mode)
  devtools: {
    wipeDatabase: () => ipcRenderer.invoke("devtools:wipeDatabase"),
    isDev: () => ipcRenderer.invoke("devtools:isDev"),
  },
});

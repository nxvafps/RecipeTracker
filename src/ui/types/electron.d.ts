export {};

declare global {
  interface Window {
    electronAPI: {
      auth: {
        register: (
          username: string,
          password: string
        ) => Promise<{
          success: boolean;
          message: string;
          user?: { id: number; username: string; created_at: string };
        }>;
        login: (
          username: string,
          password: string
        ) => Promise<{
          success: boolean;
          message: string;
          user?: { id: number; username: string; created_at: string };
        }>;
        logout: () => Promise<{ success: boolean; message: string }>;
        getCurrentUser: () => Promise<{
          id: number;
          username: string;
          created_at: string;
        } | null>;
      };
      devtools: {
        wipeDatabase: () => Promise<{ success: boolean; message: string }>;
        isDev: () => Promise<boolean>;
        getDatabaseStats: () => Promise<{
          success: boolean;
          stats?: {
            userCount: number;
            tables: Array<{ name: string; rowCount: number }>;
            dbPath: string;
            fileSize: number;
          };
          message?: string;
        }>;
        seedDatabase: () => Promise<{ success: boolean; message: string }>;
        exportDatabase: () => Promise<{
          success: boolean;
          data?: any;
          message?: string;
        }>;
        executeQuery: (query: string) => Promise<{
          success: boolean;
          results?: any;
          message?: string;
        }>;
      };
    };
  }
}

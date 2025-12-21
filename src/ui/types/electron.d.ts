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
    };
  }
}

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
      ingredients: {
        add: (
          name: string,
          unit: string
        ) => Promise<{
          success: boolean;
          message: string;
          ingredient?: {
            id: number;
            name: string;
            unit: string;
            user_id: number;
            created_at: string;
          };
        }>;
        getAll: () => Promise<{
          success: boolean;
          ingredients?: Array<{
            id: number;
            name: string;
            unit: string;
            user_id: number;
            created_at: string;
          }>;
          message?: string;
        }>;
        update: (
          id: number,
          name: string,
          unit: string
        ) => Promise<{
          success: boolean;
          message: string;
          ingredient?: {
            id: number;
            name: string;
            unit: string;
            user_id: number;
            created_at: string;
          };
        }>;
        delete: (id: number) => Promise<{ success: boolean; message: string }>;
      };
      recipes: {
        add: (input: {
          name: string;
          servings: number;
          timeNeeded: number;
          ingredients: Array<{ ingredientId: number; quantity: string }>;
          instructions: string[];
        }) => Promise<{
          success: boolean;
          message: string;
          recipe?: {
            id: number;
            name: string;
            servings: number;
            time_needed: number;
            user_id: number;
            created_at: string;
            ingredients: Array<{
              id: number;
              recipe_id: number;
              ingredient_id: number;
              quantity: string;
              ingredient_name?: string;
              ingredient_unit?: string;
            }>;
            instructions: Array<{
              id: number;
              recipe_id: number;
              step_number: number;
              instruction: string;
            }>;
          };
        }>;
        getAll: () => Promise<{
          success: boolean;
          recipes?: Array<{
            id: number;
            name: string;
            servings: number;
            time_needed: number;
            user_id: number;
            created_at: string;
          }>;
          message?: string;
        }>;
        getById: (id: number) => Promise<{
          success: boolean;
          recipe?: {
            id: number;
            name: string;
            servings: number;
            time_needed: number;
            user_id: number;
            created_at: string;
            ingredients: Array<{
              id: number;
              recipe_id: number;
              ingredient_id: number;
              quantity: string;
              ingredient_name?: string;
              ingredient_unit?: string;
            }>;
            instructions: Array<{
              id: number;
              recipe_id: number;
              step_number: number;
              instruction: string;
            }>;
          };
          message?: string;
        }>;
        update: (
          id: number,
          input: {
            name: string;
            servings: number;
            timeNeeded: number;
            ingredients: Array<{ ingredientId: number; quantity: string }>;
            instructions: string[];
          }
        ) => Promise<{
          success: boolean;
          message: string;
          recipe?: {
            id: number;
            name: string;
            servings: number;
            time_needed: number;
            user_id: number;
            created_at: string;
            ingredients: Array<{
              id: number;
              recipe_id: number;
              ingredient_id: number;
              quantity: string;
              ingredient_name?: string;
              ingredient_unit?: string;
            }>;
            instructions: Array<{
              id: number;
              recipe_id: number;
              step_number: number;
              instruction: string;
            }>;
          };
        }>;
        delete: (id: number) => Promise<{ success: boolean; message: string }>;
        export: (recipeIds: number[]) => Promise<{
          success: boolean;
          message: string;
          filepath?: string;
          filename?: string;
        }>;
        import: () => Promise<{
          success: boolean;
          message: string;
          imported?: number;
          failed?: number;
        }>;
      };
      shoppingList: {
        addItems: (
          items: Array<{
            ingredientId?: number;
            ingredientName: string;
            ingredientUnit: string;
            quantity: string;
          }>
        ) => Promise<{
          success: boolean;
          message: string;
          items?: Array<{
            id: number;
            ingredient_id: number | null;
            ingredient_name: string;
            ingredient_unit: string;
            quantity: string;
            user_id: number;
            created_at: string;
          }>;
        }>;
        getAll: () => Promise<{
          success: boolean;
          items?: Array<{
            id: number;
            ingredient_id: number | null;
            ingredient_name: string;
            ingredient_unit: string;
            quantity: string;
            user_id: number;
            created_at: string;
          }>;
          message?: string;
        }>;
        update: (
          id: number,
          quantity: string
        ) => Promise<{
          success: boolean;
          message: string;
          item?: {
            id: number;
            ingredient_id: number | null;
            ingredient_name: string;
            ingredient_unit: string;
            quantity: string;
            user_id: number;
            created_at: string;
          };
        }>;
        delete: (id: number) => Promise<{ success: boolean; message: string }>;
        clear: () => Promise<{ success: boolean; message: string }>;
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

import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import bcrypt from "bcryptjs";
import fs from "fs";

const dbPath = path.join(app.getPath("userData"), "recipe-tracker.db");
const db = new Database(dbPath);

// Initialize database tables
export function initDatabase() {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create session table for tracking logged in user
  db.exec(`
    CREATE TABLE IF NOT EXISTS active_session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id INTEGER,
      username TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create ingredients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create recipes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      servings INTEGER NOT NULL,
      time_needed INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create recipe_ingredients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      ingredient_id INTEGER NOT NULL,
      quantity TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    )
  `);

  // Create recipe_instructions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipe_instructions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      step_number INTEGER NOT NULL,
      instruction TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    )
  `);

  console.log("Database initialized at:", dbPath);
}

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

// Register a new user
export function registerUser(username: string, password: string): AuthResult {
  try {
    // Validate input
    if (!username || username.trim().length < 3) {
      return {
        success: false,
        message: "Username must be at least 3 characters long",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
      };
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    const stmt = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    const result = stmt.run(username.trim(), hashedPassword);

    return {
      success: true,
      message: "Account created successfully",
      user: {
        id: result.lastInsertRowid as number,
        username: username.trim(),
        created_at: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return {
        success: false,
        message: "Username already exists",
      };
    }
    return {
      success: false,
      message: "Failed to create account",
    };
  }
}

// Login user
export function loginUser(username: string, password: string): AuthResult {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username.trim()) as any;

    if (!user) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    // Verify password
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid username or password",
      };
    }

    // Store active session
    db.prepare("DELETE FROM active_session").run();
    db.prepare(
      "INSERT INTO active_session (id, user_id, username) VALUES (1, ?, ?)"
    ).run(user.id, user.username);

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Login failed",
    };
  }
}

// Logout user
export function logoutUser(): { success: boolean; message: string } {
  try {
    db.prepare("DELETE FROM active_session").run();
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Logout failed",
    };
  }
}

// Check if user is logged in
export function getCurrentUser(): User | null {
  try {
    const stmt = db.prepare("SELECT * FROM active_session WHERE id = 1");
    const session = stmt.get() as any;

    if (!session) {
      return null;
    }

    return {
      id: session.user_id,
      username: session.username,
      created_at: "",
    };
  } catch (error) {
    return null;
  }
}

// Wipe database (for development only)
export function wipeDatabase(): { success: boolean; message: string } {
  try {
    // Drop all tables in reverse order of dependencies
    db.exec("DROP TABLE IF EXISTS recipe_instructions");
    db.exec("DROP TABLE IF EXISTS recipe_ingredients");
    db.exec("DROP TABLE IF EXISTS recipes");
    db.exec("DROP TABLE IF EXISTS ingredients");
    db.exec("DROP TABLE IF EXISTS active_session");
    db.exec("DROP TABLE IF EXISTS users");

    // Reinitialize the database
    initDatabase();

    return {
      success: true,
      message: "Database wiped and reinitialized successfully",
    };
  } catch (error: any) {
    console.error("Failed to wipe database:", error);
    return {
      success: false,
      message: "Failed to wipe database: " + error.message,
    };
  }
}

// Get database statistics
export function getDatabaseStats(): {
  success: boolean;
  stats?: {
    userCount: number;
    tables: Array<{ name: string; rowCount: number }>;
    dbPath: string;
    fileSize: number;
  };
  message?: string;
} {
  try {
    // Get user count
    const userCount = db
      .prepare("SELECT COUNT(*) as count FROM users")
      .get() as { count: number };

    // Get all tables
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all() as Array<{ name: string }>;

    // Get row count for each table
    const tableStats = tables.map((table) => {
      const result = db
        .prepare(`SELECT COUNT(*) as count FROM ${table.name}`)
        .get() as { count: number };
      return {
        name: table.name,
        rowCount: result.count,
      };
    });

    // Get file size
    const stats = fs.statSync(dbPath);
    const fileSizeInBytes = stats.size;

    return {
      success: true,
      stats: {
        userCount: userCount.count,
        tables: tableStats,
        dbPath,
        fileSize: fileSizeInBytes,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to get database stats: " + error.message,
    };
  }
}

// Seed database with sample data
export function seedDatabase(): { success: boolean; message: string } {
  try {
    // Get all users from the database
    const users = db.prepare("SELECT id, username FROM users").all() as Array<{
      id: number;
      username: string;
    }>;

    if (users.length === 0) {
      return {
        success: false,
        message:
          "No users found in the database. Please create a user account first.",
      };
    }

    let totalIngredientsCreated = 0;
    let totalRecipesCreated = 0;
    const usersSeeded: string[] = [];

    // Seed data for each user
    users.forEach((user) => {
      const userId = user.id;
      let ingredientsCreated = 0;
      let recipesCreated = 0;

      // Sample ingredients
      const sampleIngredients = [
        { name: "All-Purpose Flour", unit: "cup" },
        { name: "Sugar", unit: "cup" },
        { name: "Butter", unit: "tablespoon" },
        { name: "Eggs", unit: "unit" },
        { name: "Milk", unit: "cup" },
        { name: "Salt", unit: "teaspoon" },
        { name: "Baking Powder", unit: "teaspoon" },
        { name: "Vanilla Extract", unit: "teaspoon" },
        { name: "Chicken Breast", unit: "pound" },
        { name: "Olive Oil", unit: "tablespoon" },
        { name: "Garlic", unit: "clove" },
        { name: "Onion", unit: "unit" },
        { name: "Tomato", unit: "unit" },
        { name: "Pasta", unit: "pound" },
        { name: "Parmesan Cheese", unit: "cup" },
      ];

      const ingredientIds: number[] = [];
      const insertIngredient = db.prepare(
        "INSERT INTO ingredients (name, unit, user_id) VALUES (?, ?, ?)"
      );

      sampleIngredients.forEach((ingredient) => {
        try {
          const result = insertIngredient.run(
            ingredient.name,
            ingredient.unit,
            userId
          );
          ingredientIds.push(result.lastInsertRowid as number);
          ingredientsCreated++;
        } catch (error) {
          // Ingredient might already exist, skip it
          console.log(
            `Ingredient ${ingredient.name} for user ${user.username} might already exist`
          );
        }
      });

      // Sample recipes
      if (ingredientIds.length >= 8) {
        const sampleRecipes = [
          {
            name: "Classic Pancakes",
            servings: 4,
            timeNeeded: 20,
            ingredients: [
              { ingredientId: ingredientIds[0], quantity: "2" }, // Flour
              { ingredientId: ingredientIds[1], quantity: "2" }, // Sugar
              { ingredientId: ingredientIds[2], quantity: "2" }, // Butter
              { ingredientId: ingredientIds[3], quantity: "2" }, // Eggs
              { ingredientId: ingredientIds[4], quantity: "1.5" }, // Milk
              { ingredientId: ingredientIds[6], quantity: "2" }, // Baking Powder
            ],
            instructions: [
              "Mix dry ingredients (flour, sugar, baking powder) in a large bowl",
              "In another bowl, whisk eggs, milk, and melted butter",
              "Pour wet ingredients into dry ingredients and mix until just combined",
              "Heat a griddle or pan over medium heat",
              "Pour 1/4 cup of batter for each pancake",
              "Cook until bubbles form on top, then flip and cook until golden brown",
            ],
          },
          {
            name: "Garlic Butter Chicken",
            servings: 4,
            timeNeeded: 30,
            ingredients: [
              { ingredientId: ingredientIds[8], quantity: "1.5" }, // Chicken
              { ingredientId: ingredientIds[9], quantity: "2" }, // Olive Oil
              { ingredientId: ingredientIds[10], quantity: "4" }, // Garlic
              { ingredientId: ingredientIds[2], quantity: "3" }, // Butter
              { ingredientId: ingredientIds[5], quantity: "1" }, // Salt
            ],
            instructions: [
              "Season chicken breasts with salt and pepper",
              "Heat olive oil in a large skillet over medium-high heat",
              "Add chicken and cook for 6-7 minutes per side until golden and cooked through",
              "Remove chicken and set aside",
              "In the same pan, add butter and minced garlic",
              "Cook garlic for 1-2 minutes until fragrant",
              "Return chicken to pan and coat with garlic butter",
              "Serve hot with your choice of sides",
            ],
          },
          {
            name: "Simple Pasta with Tomato",
            servings: 2,
            timeNeeded: 25,
            ingredients: [
              { ingredientId: ingredientIds[13], quantity: "0.5" }, // Pasta
              { ingredientId: ingredientIds[12], quantity: "4" }, // Tomato
              { ingredientId: ingredientIds[10], quantity: "3" }, // Garlic
              { ingredientId: ingredientIds[9], quantity: "3" }, // Olive Oil
              { ingredientId: ingredientIds[14], quantity: "0.5" }, // Parmesan
              { ingredientId: ingredientIds[5], quantity: "1" }, // Salt
            ],
            instructions: [
              "Bring a large pot of salted water to boil",
              "Cook pasta according to package directions",
              "Meanwhile, dice tomatoes and mince garlic",
              "Heat olive oil in a pan and sauté garlic until fragrant",
              "Add tomatoes and cook for 10 minutes until softened",
              "Season with salt to taste",
              "Drain pasta and toss with tomato sauce",
              "Top with grated Parmesan cheese and serve",
            ],
          },
        ];

        const insertRecipe = db.prepare(
          "INSERT INTO recipes (name, servings, time_needed, user_id) VALUES (?, ?, ?, ?)"
        );
        const insertRecipeIngredient = db.prepare(
          "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)"
        );
        const insertInstruction = db.prepare(
          "INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)"
        );

        sampleRecipes.forEach((recipe) => {
          try {
            const recipeResult = insertRecipe.run(
              recipe.name,
              recipe.servings,
              recipe.timeNeeded,
              userId
            );
            const recipeId = recipeResult.lastInsertRowid as number;

            // Insert recipe ingredients
            recipe.ingredients.forEach((ing) => {
              insertRecipeIngredient.run(
                recipeId,
                ing.ingredientId,
                ing.quantity
              );
            });

            // Insert instructions
            recipe.instructions.forEach((instruction, index) => {
              insertInstruction.run(recipeId, index + 1, instruction);
            });

            recipesCreated++;
          } catch (error) {
            console.log(`Failed to create recipe ${recipe.name}:`, error);
          }
        });
      }

      // Track users that had data seeded
      if (ingredientsCreated > 0 || recipesCreated > 0) {
        usersSeeded.push(user.username);
        totalIngredientsCreated += ingredientsCreated;
        totalRecipesCreated += recipesCreated;
      }
    });

    const messages = [];
    if (totalIngredientsCreated > 0) {
      messages.push(`${totalIngredientsCreated} ingredient(s)`);
    }
    if (totalRecipesCreated > 0) {
      messages.push(`${totalRecipesCreated} recipe(s)`);
    }

    if (messages.length > 0) {
      return {
        success: true,
        message: `Created ${messages.join(", ")} for ${
          usersSeeded.length
        } user(s): ${usersSeeded.join(", ")}.`,
      };
    } else {
      return {
        success: true,
        message:
          "All sample data already exists for all users. No new data created.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to seed database: " + error.message,
    };
  }
}

// Export database data as JSON
export function exportDatabaseData(): {
  success: boolean;
  data?: any;
  message?: string;
} {
  try {
    const users = db
      .prepare("SELECT id, username, created_at FROM users")
      .all();
    const activeSession = db.prepare("SELECT * FROM active_session").all();

    return {
      success: true,
      data: {
        users,
        activeSession,
        exportedAt: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to export database: " + error.message,
    };
  }
}

// Import database data from JSON
export function importDatabaseData(data: any): {
  success: boolean;
  message: string;
} {
  try {
    // This is a simplified import - in production you'd want more validation
    if (data.users && Array.isArray(data.users)) {
      // Clear existing data
      db.prepare("DELETE FROM active_session").run();
      db.prepare("DELETE FROM users").run();

      // Note: This won't import passwords, users will need to re-register
      // This is intentional for security
      return {
        success: false,
        message:
          "Import not fully implemented - would need to handle password hashing",
      };
    }

    return {
      success: false,
      message: "Invalid import data format",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to import database: " + error.message,
    };
  }
}

// Execute custom SQL query (read-only for safety)
export function executeQuery(query: string): {
  success: boolean;
  results?: any;
  message?: string;
} {
  try {
    // Only allow SELECT queries for safety
    const trimmedQuery = query.trim().toUpperCase();
    if (
      !trimmedQuery.startsWith("SELECT") &&
      !trimmedQuery.startsWith("PRAGMA")
    ) {
      return {
        success: false,
        message: "Only SELECT and PRAGMA queries are allowed for safety",
      };
    }

    const results = db.prepare(query).all();

    return {
      success: true,
      results,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Query failed: " + error.message,
    };
  }
}

export { db };

// Ingredient interfaces and functions
export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  user_id: number;
  created_at: string;
}

// Add a new ingredient
export function addIngredient(
  name: string,
  unit: string,
  userId: number
): { success: boolean; message: string; ingredient?: Ingredient } {
  try {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        message: "Ingredient name is required",
      };
    }

    if (!unit || unit.trim().length === 0) {
      return {
        success: false,
        message: "Unit is required",
      };
    }

    const stmt = db.prepare(
      "INSERT INTO ingredients (name, unit, user_id) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name.trim(), unit.trim(), userId);

    const newIngredient = db
      .prepare("SELECT * FROM ingredients WHERE id = ?")
      .get(result.lastInsertRowid) as Ingredient;

    return {
      success: true,
      message: "Ingredient added successfully",
      ingredient: newIngredient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to add ingredient: " + error.message,
    };
  }
}

// Get all ingredients for a user
export function getIngredients(userId: number): {
  success: boolean;
  ingredients?: Ingredient[];
  message?: string;
} {
  try {
    const stmt = db.prepare(
      "SELECT * FROM ingredients WHERE user_id = ? ORDER BY created_at DESC"
    );
    const ingredients = stmt.all(userId) as Ingredient[];

    return {
      success: true,
      ingredients,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to get ingredients: " + error.message,
    };
  }
}

// Update an ingredient
export function updateIngredient(
  id: number,
  name: string,
  unit: string,
  userId: number
): { success: boolean; message: string; ingredient?: Ingredient } {
  try {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        message: "Ingredient name is required",
      };
    }

    if (!unit || unit.trim().length === 0) {
      return {
        success: false,
        message: "Unit is required",
      };
    }

    const stmt = db.prepare(
      "UPDATE ingredients SET name = ?, unit = ? WHERE id = ? AND user_id = ?"
    );
    const result = stmt.run(name.trim(), unit.trim(), id, userId);

    if (result.changes === 0) {
      return {
        success: false,
        message: "Ingredient not found or not authorized",
      };
    }

    const updatedIngredient = db
      .prepare("SELECT * FROM ingredients WHERE id = ?")
      .get(id) as Ingredient;

    return {
      success: true,
      message: "Ingredient updated successfully",
      ingredient: updatedIngredient,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update ingredient: " + error.message,
    };
  }
}

// Delete an ingredient
export function deleteIngredient(
  id: number,
  userId: number
): { success: boolean; message: string } {
  try {
    const stmt = db.prepare(
      "DELETE FROM ingredients WHERE id = ? AND user_id = ?"
    );
    const result = stmt.run(id, userId);

    if (result.changes === 0) {
      return {
        success: false,
        message: "Ingredient not found or not authorized",
      };
    }

    return {
      success: true,
      message: "Ingredient deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to delete ingredient: " + error.message,
    };
  }
}

// Recipe interfaces and functions
export interface Recipe {
  id: number;
  name: string;
  servings: number;
  time_needed: number;
  user_id: number;
  created_at: string;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  ingredient_id: number;
  quantity: string;
  ingredient_name?: string;
  ingredient_unit?: string;
}

export interface RecipeInstruction {
  id: number;
  recipe_id: number;
  step_number: number;
  instruction: string;
}

export interface RecipeWithDetails extends Recipe {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}

export interface RecipeInput {
  name: string;
  servings: number;
  timeNeeded: number;
  ingredients: Array<{ ingredientId: number; quantity: string }>;
  instructions: string[];
}

// Add a new recipe
export function addRecipe(
  input: RecipeInput,
  userId: number
): { success: boolean; message: string; recipe?: RecipeWithDetails } {
  try {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, message: "Recipe name is required" };
    }
    if (input.servings <= 0) {
      return { success: false, message: "Servings must be greater than 0" };
    }
    if (input.timeNeeded <= 0) {
      return { success: false, message: "Time needed must be greater than 0" };
    }
    if (!input.ingredients || input.ingredients.length === 0) {
      return { success: false, message: "At least one ingredient is required" };
    }
    if (!input.instructions || input.instructions.length === 0) {
      return {
        success: false,
        message: "At least one instruction is required",
      };
    }

    // Start transaction
    const insertRecipe = db.prepare(
      "INSERT INTO recipes (name, servings, time_needed, user_id) VALUES (?, ?, ?, ?)"
    );
    const insertIngredient = db.prepare(
      "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)"
    );
    const insertInstruction = db.prepare(
      "INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)"
    );

    // Insert recipe
    const result = insertRecipe.run(
      input.name.trim(),
      input.servings,
      input.timeNeeded,
      userId
    );
    const recipeId = result.lastInsertRowid as number;

    // Insert ingredients
    input.ingredients.forEach((ing) => {
      insertIngredient.run(recipeId, ing.ingredientId, ing.quantity);
    });

    // Insert instructions
    input.instructions.forEach((instruction, index) => {
      insertInstruction.run(recipeId, index + 1, instruction);
    });

    // Get the complete recipe
    const recipe = getRecipeById(recipeId, userId);
    if (recipe.success && recipe.recipe) {
      return {
        success: true,
        message: "Recipe added successfully",
        recipe: recipe.recipe,
      };
    }

    return { success: false, message: "Failed to retrieve created recipe" };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to add recipe: " + error.message,
    };
  }
}

// Get all recipes for a user
export function getRecipes(userId: number): {
  success: boolean;
  recipes?: Recipe[];
  message?: string;
} {
  try {
    const stmt = db.prepare(
      "SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC"
    );
    const recipes = stmt.all(userId) as Recipe[];

    return {
      success: true,
      recipes,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to get recipes: " + error.message,
    };
  }
}

// Get a specific recipe with all details
export function getRecipeById(
  id: number,
  userId: number
): {
  success: boolean;
  recipe?: RecipeWithDetails;
  message?: string;
} {
  try {
    // Get recipe
    const recipeStmt = db.prepare(
      "SELECT * FROM recipes WHERE id = ? AND user_id = ?"
    );
    const recipe = recipeStmt.get(id, userId) as Recipe;

    if (!recipe) {
      return {
        success: false,
        message: "Recipe not found or not authorized",
      };
    }

    // Get ingredients
    const ingredientsStmt = db.prepare(`
      SELECT ri.*, i.name as ingredient_name, i.unit as ingredient_unit
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = ?
    `);
    const ingredients = ingredientsStmt.all(id) as RecipeIngredient[];

    // Get instructions
    const instructionsStmt = db.prepare(
      "SELECT * FROM recipe_instructions WHERE recipe_id = ? ORDER BY step_number"
    );
    const instructions = instructionsStmt.all(id) as RecipeInstruction[];

    return {
      success: true,
      recipe: {
        ...recipe,
        ingredients,
        instructions,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to get recipe: " + error.message,
    };
  }
}

// Update a recipe
export function updateRecipe(
  id: number,
  input: RecipeInput,
  userId: number
): { success: boolean; message: string; recipe?: RecipeWithDetails } {
  try {
    // Validate input
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, message: "Recipe name is required" };
    }
    if (input.servings <= 0) {
      return { success: false, message: "Servings must be greater than 0" };
    }
    if (input.timeNeeded <= 0) {
      return { success: false, message: "Time needed must be greater than 0" };
    }

    // Update recipe
    const updateStmt = db.prepare(
      "UPDATE recipes SET name = ?, servings = ?, time_needed = ? WHERE id = ? AND user_id = ?"
    );
    const result = updateStmt.run(
      input.name.trim(),
      input.servings,
      input.timeNeeded,
      id,
      userId
    );

    if (result.changes === 0) {
      return {
        success: false,
        message: "Recipe not found or not authorized",
      };
    }

    // Delete existing ingredients and instructions
    db.prepare("DELETE FROM recipe_ingredients WHERE recipe_id = ?").run(id);
    db.prepare("DELETE FROM recipe_instructions WHERE recipe_id = ?").run(id);

    // Insert new ingredients
    const insertIngredient = db.prepare(
      "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)"
    );
    input.ingredients.forEach((ing) => {
      insertIngredient.run(id, ing.ingredientId, ing.quantity);
    });

    // Insert new instructions
    const insertInstruction = db.prepare(
      "INSERT INTO recipe_instructions (recipe_id, step_number, instruction) VALUES (?, ?, ?)"
    );
    input.instructions.forEach((instruction, index) => {
      insertInstruction.run(id, index + 1, instruction);
    });

    // Get the updated recipe
    const recipe = getRecipeById(id, userId);
    if (recipe.success && recipe.recipe) {
      return {
        success: true,
        message: "Recipe updated successfully",
        recipe: recipe.recipe,
      };
    }

    return { success: false, message: "Failed to retrieve updated recipe" };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update recipe: " + error.message,
    };
  }
}

// Delete a recipe
export function deleteRecipe(
  id: number,
  userId: number
): { success: boolean; message: string } {
  try {
    const stmt = db.prepare("DELETE FROM recipes WHERE id = ? AND user_id = ?");
    const result = stmt.run(id, userId);

    if (result.changes === 0) {
      return {
        success: false,
        message: "Recipe not found or not authorized",
      };
    }

    return {
      success: true,
      message: "Recipe deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to delete recipe: " + error.message,
    };
  }
}

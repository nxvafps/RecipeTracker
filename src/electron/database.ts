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
    // Drop all tables
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
    // Create sample users
    const sampleUsers = [
      { username: "testuser1", password: "password123" },
      { username: "testuser2", password: "password123" },
      { username: "chef_john", password: "password123" },
    ];

    let createdCount = 0;
    let existingCount = 0;

    sampleUsers.forEach((user) => {
      const result = registerUser(user.username, user.password);
      if (result.success) {
        createdCount++;
      } else {
        existingCount++;
      }
    });

    if (createdCount > 0) {
      return {
        success: true,
        message: `Created ${createdCount} new user(s). ${existingCount} user(s) already existed.`,
      };
    } else {
      return {
        success: true,
        message: `All ${sampleUsers.length} sample users already exist. No new users created.`,
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

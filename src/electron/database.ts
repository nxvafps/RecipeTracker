import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import bcrypt from "bcryptjs";

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

export { db };

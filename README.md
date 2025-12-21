# Recipe Tracker

A desktop recipe management application built with Electron, React, TypeScript, and SQLite.

## Features

- **User Authentication**: Secure login system with SQLite database
  - Create new accounts with username and password
  - Password visibility toggle for easy input verification
  - Secure password hashing using bcrypt
  - Persistent sessions
- **Recipe Management**: Track and organize your recipes
- **Shopping List**: Manage your shopping items
- **Modern UI**: Built with React and styled-components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

This will:

- Start the Vite development server on http://localhost:5123
- Compile the Electron TypeScript files
- Launch the Electron application

### Building

Build for your platform:

```bash
# macOS (ARM64)
npm run dist:mac

# Windows (x64)
npm run dist:win

# Linux (x64)
npm run dist:linux
```

## Authentication System

The app includes a complete authentication system:

1. **First Launch**: You'll see a registration screen where you can create your account
2. **Username**: Must be at least 3 characters long and unique
3. **Password**: Must be at least 6 characters long
4. **Password Visibility**: Click the eye icon to show/hide your password while typing
5. **Persistent Login**: Once logged in, your session persists across app restarts
6. **Logout**: Click "Sign Out" in the sidebar to logout

### Database Location

User data is stored in an SQLite database at:

- macOS: `~/Library/Application Support/recipe-tracker/recipe-tracker.db`
- Windows: `%APPDATA%/recipe-tracker/recipe-tracker.db`
- Linux: `~/.config/recipe-tracker/recipe-tracker.db`

## Technology Stack

- **Frontend**: React 19, TypeScript, styled-components, React Router
- **Backend**: Electron, SQLite (better-sqlite3)
- **Security**: bcryptjs for password hashing
- **Build**: Vite, electron-builder

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

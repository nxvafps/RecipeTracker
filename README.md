# Recipe Tracker

A powerful desktop application for managing recipes, ingredients, and shopping lists. Built with modern web technologies and packaged as a native desktop application using Electron.

## Overview

Recipe Tracker is a complete recipe management solution that helps you organize your culinary collection, manage ingredients, and create shopping lists from your favorite recipes. With a clean, modern interface and robust local database, all your data stays private and accessible offline.

## Features

### 🔐 User Authentication

- **Secure Login System**: Complete authentication with username and password
- **Account Management**: Easy registration for new users
- **Password Security**: Industry-standard bcrypt hashing (10 salt rounds)
- **Persistent Sessions**: Stay logged in across app restarts
- **Password Visibility Toggle**: Convenient password input with show/hide functionality
- **User Isolation**: All data is scoped to individual users

### 📖 Recipe Management

- **Create & Edit Recipes**: Add recipes with name, servings, prep time, ingredients, and step-by-step instructions
- **Recipe Details**: View complete recipe information including all ingredients and cooking instructions
- **Search Functionality**: Quickly find recipes by name
- **Recipe Selection**: Multi-select recipes for bulk operations
- **Import/Export**: Share recipes via JSON export/import
  - Export single or multiple recipes
  - Import recipes from JSON files with automatic ingredient matching
- **Recipe Organization**: View all recipes in a clean, card-based layout

### 🥕 Ingredient Management

- **Ingredient Library**: Maintain a personal database of ingredients
- **Unit Tracking**: Store measurement units (cups, tablespoons, grams, etc.)
- **CRUD Operations**: Create, read, update, and delete ingredients
- **Automatic Linking**: Recipes automatically link to your ingredient library

### 🛒 Shopping List

- **Smart List Generation**: Add ingredients from selected recipes to your shopping list
- **Automatic Quantity Combining**: Duplicate ingredients are automatically merged with combined quantities
- **Quantity Management**: Edit quantities directly in the shopping list
- **List Export**: Export your shopping list for printing or sharing
- **Quick Clear**: Clear all items when shopping is complete
- **Empty State Guidance**: Helpful prompts when list is empty

### 🎨 Modern User Interface

- **Clean Design**: Beautiful, intuitive interface built with styled-components
- **Responsive Layout**: Sidebar navigation with main content area
- **Theme Support**: Consistent color scheme and typography
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Clear error messages and validation
- **Empty States**: Helpful guidance when no data exists

### 🛠️ Developer Tools (Development Mode)

- **Database Management**: View database statistics
- **Quick Actions**: Wipe database for testing
- **Debug Panel**: Only visible in development mode

## Getting Started

### Prerequisites

- **Node.js**: v16 or higher
- **npm**: Comes with Node.js

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Recipe-Tracker
```

2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

This command will:

1. Start the Vite development server on `http://localhost:5123`
2. Compile the Electron TypeScript files
3. Launch the Electron application with hot-reload enabled

The app will automatically reload when you make changes to the React code. For Electron main process changes, restart the dev server.

### Building for Production

Build distributable packages for your platform:

```bash
# macOS (ARM64 - Apple Silicon)
npm run dist:mac

# Windows (x64)
npm run dist:win

# Linux (x64)
npm run dist:linux
```

Build output will be in the `dist/` directory.

### Available Scripts

- `npm run dev` - Start development environment (React + Electron)
- `npm run dev:react` - Start only Vite dev server
- `npm run dev:electron` - Start only Electron app
- `npm run build` - Build React app for production
- `npm run transpile:electron` - Compile Electron TypeScript
- `npm run lint` - Run ESLint
- `npm run dist:mac` - Build macOS app (ARM64)
- `npm run dist:win` - Build Windows app (x64)
- `npm run dist:linux` - Build Linux app (x64)

## Usage Guide

### First Launch

1. **Registration**: On first launch, you'll see the registration screen

   - Choose a username (minimum 3 characters, must be unique)
   - Choose a password (minimum 6 characters)
   - Use the eye icon to toggle password visibility
   - Click "Register" to create your account

2. **Subsequent Launches**: You'll stay logged in automatically

### Working with Ingredients

1. Navigate to the **Ingredients** page from the sidebar
2. Click **"Add Ingredient"** to create new ingredients
3. Provide a name and unit (e.g., "Flour" with unit "cups")
4. Edit or delete ingredients as needed

💡 **Tip**: Create your ingredient library first - you'll need it when adding recipes

### Creating Recipes

1. Go to the **Recipes** page
2. Click **"Add Recipe"**
3. Fill in the recipe details:
   - Recipe name
   - Number of servings
   - Preparation time (minutes)
   - Add ingredients from your library with quantities
   - Add step-by-step instructions
4. Click **"Add Recipe"** to save

### Managing Recipes

- **Search**: Use the search bar to find recipes by name
- **View Details**: Click on a recipe card to see the full recipe
- **Edit**: Click the edit button on a recipe card
- **Delete**: Remove recipes you no longer need
- **Select Multiple**: Use checkboxes to select multiple recipes for bulk operations

### Building a Shopping List

1. Navigate to the **Recipes** page
2. Select one or more recipes using the checkboxes
3. Click **"Add X Recipe(s) to Shopping List"**
4. Go to the **Shopping List** page to view your list

The shopping list will automatically combine duplicate ingredients and sum their quantities.

### Import/Export Recipes

**Export Recipes:**

1. Select one or more recipes on the Recipes page
2. Click **"Export X Recipe(s)"**
3. Choose where to save the JSON file
4. Share the file with friends or back it up

**Import Recipes:**

1. Click **"Import Recipes"** on the Recipes page
2. Select a JSON file exported from Recipe Tracker
3. The app will automatically match ingredients or create new ones
4. Review the success message to see how many recipes were imported

### Logout

Click **"Sign Out"** in the sidebar to logout. Your data remains securely stored.

## Data Storage

### Database Location

All user data is stored locally in an SQLite database. The database location varies by operating system:

- **macOS**: `~/Library/Application Support/recipe-tracker/recipe-tracker.db`
- **Windows**: `%APPDATA%/recipe-tracker/recipe-tracker.db`
- **Linux**: `~/.config/recipe-tracker/recipe-tracker.db`

### Data Privacy

- All data is stored locally on your machine
- No data is sent to external servers
- Each user's data is completely isolated
- Passwords are securely hashed and never stored in plaintext

### Backup

To backup your data, simply copy the database file from the location above. To restore, replace the file with your backup.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run linting: `npm run lint`
5. Test the application: `npm run dev`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to the branch: `git push origin feature/my-feature`
8. Submit a pull request

## License

This project is open source and available for personal and commercial use.

## Troubleshooting

### Application won't start

- Ensure Node.js v16+ is installed
- Try deleting `node_modules` and running `npm install` again
- Check for error messages in the terminal

### Database errors

- The database is automatically created on first launch
- If you encounter database corruption, you can delete the database file (see Data Storage section)
- A fresh database will be created on next launch

### Build issues

- Ensure all dependencies are installed: `npm install`
- Try cleaning and rebuilding: `rm -rf dist-electron dist-react && npm run build`

## Version History

### 1.0.0 (December 2025)

- Initial release
- Complete user authentication system
- Recipe management with full CRUD operations
- Ingredient library
- Shopping list with smart quantity combining
- Import/Export functionality
- Multi-recipe selection
- Search functionality
- Cross-platform builds (macOS, Windows, Linux)

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://react.dev/)
- Styled with [styled-components](https://styled-components.com/)
- Database: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

---

**Recipe Tracker v1.0.0** - Made with ❤️ for home cooks and recipe enthusiasts

## Technology Stack

### Frontend

- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **styled-components**: CSS-in-JS styling solution
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server

### Backend

- **Electron**: Cross-platform desktop application framework
- **Node.js**: JavaScript runtime
- **better-sqlite3**: Fast, synchronous SQLite3 database
- **bcryptjs**: Password hashing library
- **IPC Communication**: Secure renderer-main process communication

### Build & Development

- **electron-builder**: Package and build for multiple platforms
- **TypeScript Compiler**: Separate configs for Electron and React
- **ESLint**: Code linting and quality
- **npm-run-all**: Parallel script execution

## Architecture

### Database Schema

The application uses SQLite with the following main tables:

- **users**: User accounts with hashed passwords
- **ingredients**: User-specific ingredient library
- **recipes**: Recipe metadata (name, servings, time)
- **recipe_ingredients**: Junction table linking recipes to ingredients with quantities
- **recipe_instructions**: Step-by-step cooking instructions
- **shopping_list**: User's shopping list items

### Application Structure

```
src/
├── electron/           # Electron main process
│   ├── main.ts        # App entry point
│   ├── preload.ts     # IPC bridge
│   ├── database.ts    # SQLite operations
│   ├── *-handlers.ts  # IPC handlers for each domain
│   └── util.ts        # Helper functions
└── ui/                # React frontend
    ├── App.tsx        # Main app component
    ├── components/    # Reusable UI components
    ├── pages/         # Page components
    ├── styles/        # Global styles and theme
    └── types/         # TypeScript definitions
```

### Security Features

- Password hashing with bcrypt (10 salt rounds)
- User-scoped database queries (all data isolated by user_id)
- No plaintext password storage
- Secure IPC communication between renderer and main process

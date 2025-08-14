# Running LookAway for Windows

This guide provides step-by-step instructions for setting up and running the LookAway Windows application.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** - [Install yarn](https://yarnpkg.com/getting-started/install)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

### Verify Installation
Open Command Prompt or PowerShell and run:
```bash
node --version    # Should be 18.0.0 or higher
npm --version     # Should be 8.0.0 or higher
git --version     # Should be installed
```

## Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd lookaway-windows
```

### Step 2: Install Dependencies
```bash
npm install
# or if using yarn:
yarn install
```

**Note**: This may take a few minutes as it downloads all required packages.

### Step 3: Create Required Assets
Before running, you need to create some basic assets:

1. **Create the assets directory** (if it doesn't exist):
   ```bash
   mkdir assets
   ```

2. **Add placeholder icons** (you can use any 256x256 PNG for now):
   - Copy any PNG file to `assets/icon.png`
   - Copy any PNG file to `assets/tray-icon.png`
   - Create or download an ICO file for `assets/icon.ico`

   **Quick solution**: Download a simple icon from [favicon.io](https://favicon.io/) and rename it.

### Step 4: Build the Project
```bash
npm run build
# or
yarn build
```

This compiles the TypeScript code and prepares the application.

### Step 5: Start Development Mode
```bash
npm run dev
# or
yarn dev
```

This will:
1. Build the main process TypeScript files
2. Start the Vite development server for the renderer
3. Launch the Electron application

## Development Workflow

### Running in Development
- **Main process changes**: The TypeScript files are automatically recompiled
- **Renderer changes**: Vite hot-reloads the React components
- **Electron**: Restart the app to see main process changes

### Available Development Commands

```bash
# Start development mode (recommended for development)
npm run dev

# Build only (without starting)
npm run build

# Build main process only
npm run build:main

# Build renderer only
npm run build:renderer

# Watch main process changes
npm run build:watch

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Building for Production

### Step 1: Build the Application
```bash
npm run electron:build:win
# or
yarn electron:build:win
```

### Step 2: Create Installer
```bash
npm run electron:build:win:nsis
# or
yarn electron:build:win:nsis
```

### Step 3: Find the Installer
The NSIS installer will be created in the `release` folder:
- `release/LookAway for Windows Setup.exe`

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module" errors
**Problem**: Missing dependencies
**Solution**: 
```bash
npm install
# or
yarn install
```

#### 2. TypeScript compilation errors
**Problem**: Type definitions missing
**Solution**:
```bash
npm install --save-dev @types/node @types/electron
```

#### 3. Electron won't start
**Problem**: Missing assets or build issues
**Solution**:
1. Ensure assets directory exists with required icons
2. Clean and rebuild:
   ```bash
   rm -rf dist node_modules
   npm install
   npm run build
   ```

#### 4. Vite development server issues
**Problem**: Port conflicts or build errors
**Solution**:
1. Check if port 5173 is available
2. Kill any existing processes
3. Restart the development server

#### 5. Windows build fails
**Problem**: Missing Windows build tools
**Solution**:
```bash
npm install --global windows-build-tools
# or install Visual Studio Build Tools manually
```

### Debug Mode

To run with additional debugging:

```bash
# Enable Electron debugging
DEBUG=electron-builder npm run dev

# Enable verbose logging
npm run dev -- --verbose
```

### Logs and Debugging

- **Main process logs**: Check the terminal where you ran `npm run dev`
- **Renderer logs**: Open DevTools in the settings window (Ctrl+Shift+I)
- **Application logs**: Check `%APPDATA%/LookAwayWin/logs/` (when built)

## File Structure Overview

```
lookaway-windows/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   ├── breakEngine.ts # Break logic
│   │   ├── settings.ts    # Settings management
│   │   └── ...
│   ├── renderer/          # UI components
│   │   ├── settings/      # Settings window
│   │   └── overlay/       # Break overlay
│   └── shared/            # Shared types
├── assets/                # Icons and sounds
├── dist/                  # Built files
├── release/               # Production builds
└── package.json           # Dependencies and scripts
```

## Next Steps

After successfully running the application:

1. **Test the features**: Try different break modes and settings
2. **Customize**: Modify the settings to match your preferences
3. **Develop**: Add new features or fix bugs
4. **Build**: Create a production installer
5. **Distribute**: Share the installer with others

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console output for error messages
3. Check the README.md for detailed documentation
4. Create an issue in the repository with:
   - Your operating system version
   - Node.js version
   - Error messages
   - Steps to reproduce the issue

---

**Happy coding!** 🚀 
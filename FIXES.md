# LookAway Windows - Project Fixes Guide

## Issues Identified and Fixed

### 1. Missing Dependencies
**Problem**: TypeScript compilation errors due to missing type definitions
**Solution**: Added missing React types to package.json

### 2. Context Heuristics Constructor
**Problem**: ContextHeuristics was creating its own SettingsManager instead of accepting one
**Solution**: Modified constructor to accept SettingsManager as parameter

### 3. IPC Handler Parameter Types
**Problem**: Implicit 'any' types in IPC handlers
**Solution**: Added proper Electron.IpcMainInvokeEvent types

### 4. Missing Type Declarations
**Problem**: No type declarations for external modules
**Solution**: Created src/types/electron.d.ts with module declarations

## How to Fix and Run the Project

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Assets Directory
```bash
mkdir -p assets
```

### Step 3: Add Placeholder Icons
You need to add these files to the `assets/` directory:
- `icon.png` (256x256)
- `tray-icon.png` (32x32) 
- `icon.ico` (Windows icon)

**Quick solution**: Download any PNG files and rename them, or use:
```bash
# Download a simple icon (replace with actual download)
curl -o assets/icon.png https://via.placeholder.com/256x256/667eea/ffffff?text=LA
curl -o assets/tray-icon.png https://via.placeholder.com/32x32/667eea/ffffff?text=LA
```

### Step 4: Build the Project
```bash
npm run build
```

### Step 5: Start Development
```bash
npm run dev
```

## Known Issues and Workarounds

### 1. Electron Type Issues
**Issue**: TypeScript can't find Electron types during development
**Workaround**: The type declarations in `src/types/electron.d.ts` provide basic types

### 2. Native Module Dependencies
**Issue**: Some dependencies like `active-win` and `iohook` require native compilation
**Workaround**: These will be compiled during `npm install`

### 3. Windows Build Tools
**Issue**: Building on Windows may require Visual Studio Build Tools
**Solution**: Install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

## Development Workflow

### For Development:
1. `npm run dev` - Start development mode
2. Make changes to TypeScript files
3. Main process changes require app restart
4. Renderer changes hot-reload automatically

### For Production Build:
1. `npm run build` - Build the application
2. `npm run electron:build:win:nsis` - Create installer

## File Structure After Fixes

```
lookaway-windows/
├── src/
│   ├── main/                    # Main process (fixed)
│   ├── renderer/                # Renderer process
│   ├── shared/                  # Shared types
│   ├── types/                   # Type declarations (new)
│   └── test/                    # Test setup (fixed)
├── assets/                      # Icons (create this)
├── scripts/                     # Setup scripts
└── package.json                 # Dependencies (updated)
```

## Testing the Fixes

### 1. Check TypeScript Compilation
```bash
npm run build:main
```

### 2. Check Renderer Build
```bash
npm run build:renderer
```

### 3. Run Tests
```bash
npm run test
```

### 4. Start Development
```bash
npm run dev
```

## Troubleshooting

### If you get "Cannot find module" errors:
1. Run `npm install` again
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 18+)

### If you get build errors:
1. Ensure assets directory exists with required icons
2. Check TypeScript compilation: `npm run build:main`
3. Check for missing dependencies

### If Electron won't start:
1. Check console for error messages
2. Ensure all dependencies are installed
3. Try running with verbose logging: `npm run dev -- --verbose`

## Next Steps

After applying these fixes:

1. **Test the application**: Verify all features work correctly
2. **Add proper icons**: Replace placeholder icons with actual designs
3. **Test on different Windows versions**: Ensure compatibility
4. **Create installer**: Build the NSIS installer for distribution

## Summary

The main issues were:
- Missing type definitions for React
- Incorrect constructor parameters
- Missing type declarations for external modules
- IPC handler type issues

All these have been fixed with the provided solutions. The project should now compile and run correctly. 
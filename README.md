# LookAway for Windows

A context-aware break reminder application for Windows that implements the 20-20-20 rule and provides intelligent break scheduling based on your work patterns.

## Features

### 🎯 Core Break Engine
- **20-20-20 Rule Implementation**: 20-minute work intervals with 20-second breaks
- **Configurable Intervals**: Customize short break intervals (1-120 minutes) and durations (5-300 seconds)
- **Long Breaks**: Automatic longer breaks after N short breaks (configurable)
- **Multiple Modes**: Balanced, Deep Focus, Eye Care, and Wellness presets
- **Skip Policies**: Casual (skip allowed), Balanced (delay only), Hardcore (no skip)

### 🧠 Context Awareness
- **Idle Detection**: Automatically pauses breaks when you're away from your computer
- **Full-Screen Apps**: Pauses breaks during games, videos, or presentations
- **Focus Apps**: Pause breaks when using specific applications (VS Code, etc.)
- **Meeting Detection**: Automatically detects and pauses during video calls
- **Typing Activity**: Monitors keyboard activity to determine if you're actively working

### 🎨 User Interface
- **System Tray Only**: Runs silently in the background without taskbar clutter
- **Windows Toasts**: Gentle notifications with optional sounds
- **Floating Overlay**: Beautiful countdown overlay near your cursor during breaks
- **Settings Window**: Modern React-based settings interface
- **First-Run Wizard**: Guided setup for new users

### ⚙️ Advanced Features
- **Auto-Launch**: Start automatically with Windows
- **Multi-Monitor Support**: Overlay appears on the correct display
- **Export/Import Settings**: Backup and restore your configuration
- **Theme Support**: Light, dark, and system themes
- **Privacy-First**: All data stored locally, no cloud dependencies

## Installation

### Prerequisites
- Windows 10/11
- Node.js 18+ 
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lookaway-windows
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the project**
   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Start development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Building for Production

1. **Build the application**
   ```bash
   npm run electron:build:win:nsis
   # or
   yarn electron:build:win:nsis
   ```

2. **Find the installer**
   The NSIS installer will be created in the `release` folder.

## Usage

### First Run
1. Launch the application
2. Complete the first-run wizard to configure your preferences
3. The app will minimize to the system tray

### System Tray
- **Left-click**: Open settings window
- **Right-click**: Context menu with options:
  - Start/Pause breaks
  - Skip current break
  - Delay break (+5 minutes)
  - Change mode
  - Open settings
  - Quit

### Settings Window
The settings window provides four main sections:

#### Break Settings
- Configure short and long break intervals
- Set break durations
- Choose skip policy
- Enable/disable notifications and sounds

#### Focus Apps
- Add applications that should pause breaks
- Configure meeting detection keywords
- Manage focus and meeting detection

#### General Settings
- Auto-launch configuration
- Full-screen behavior
- Theme selection
- Export/import settings

#### Status
- Real-time break status
- Time remaining display
- Break statistics
- Manual controls

## Configuration

### Break Modes

#### Balanced (Default)
- 20-minute work intervals
- 20-second short breaks
- 5-minute long breaks every 4 short breaks
- Balanced skip policy

#### Deep Focus
- 45-minute work intervals
- 15-second short breaks
- 10-minute long breaks every 3 short breaks
- Hardcore skip policy

#### Eye Care
- 15-minute work intervals
- 30-second short breaks
- 3-minute long breaks every 6 short breaks
- Casual skip policy

#### Wellness
- 30-minute work intervals
- 60-second short breaks
- 15-minute long breaks every 2 short breaks
- Balanced skip policy

### Context Detection

The app automatically detects and pauses breaks when:

- **Idle**: No keyboard/mouse activity for 5+ minutes
- **Full-Screen**: Applications running in full-screen mode
- **Focus Apps**: Using configured focus applications
- **Meetings**: Window titles contain meeting keywords or using meeting apps

## Development

### Project Structure
```
src/
├── main/                 # Main Electron process
│   ├── index.ts         # Main entry point
│   ├── breakEngine.ts   # Break state machine
│   ├── contextHeuristics.ts # Context detection
│   ├── settings.ts      # Settings management
│   ├── tray.ts          # System tray
│   ├── overlayWindow.ts # Break overlay
│   ├── notifications.ts # Windows notifications
│   ├── autoLaunch.ts    # Auto-launch functionality
│   └── preload.ts       # Preload scripts
├── renderer/            # Renderer process
│   ├── settings/        # Settings window
│   └── overlay/         # Break overlay
└── shared/              # Shared types and utilities
    └── types.ts         # TypeScript interfaces
```

### Available Scripts

- `npm run dev` - Start development mode
- `npm run build` - Build the application
- `npm run electron:build:win` - Build Windows executable
- `npm run electron:build:win:nsis` - Build Windows installer
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing
```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
```

### Code Quality
```bash
npm run lint              # Check for linting errors
npm run lint:fix          # Fix linting errors
npm run format            # Format code
```

## Technical Details

### Architecture
- **Main Process**: Electron main process handles break logic, context detection, and system integration
- **Renderer Process**: React-based UI for settings and overlay
- **IPC Communication**: Secure communication between main and renderer processes
- **State Management**: Event-driven state machine for break management

### Dependencies
- **Electron**: Desktop application framework
- **React**: UI framework for settings window
- **TypeScript**: Type-safe JavaScript
- **electron-store**: Local settings storage
- **active-win**: Active window detection
- **auto-launch**: Windows startup integration

### Performance
- **CPU Usage**: < 3% idle, < 1% during normal operation
- **Memory Usage**: < 200MB typical
- **Context Polling**: Every 750ms for responsive detection
- **Overlay Rendering**: 60 FPS smooth animations

## Troubleshooting

### Common Issues

#### App won't start
- Check if Node.js 18+ is installed
- Ensure all dependencies are installed: `npm install`
- Check console for error messages

#### Breaks not triggering
- Verify the app is running (check system tray)
- Check if context detection is pausing breaks
- Review settings for correct intervals

#### Overlay not appearing
- Ensure overlay is enabled in settings
- Check if overlay is positioned off-screen
- Verify transparency settings in Windows

#### Auto-launch not working
- Check Windows startup settings
- Ensure app has necessary permissions
- Try running as administrator once

### Logs
Application logs are stored in:
- Windows: `%APPDATA%/LookAwayWin/logs/`

### Support
For issues and feature requests, please create an issue in the repository.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Privacy

- All settings and data are stored locally on your computer
- No data is sent to external servers
- No telemetry or analytics collection
- Open source for transparency

---

**LookAway for Windows** - Take care of your eyes, one break at a time! 👀✨ 
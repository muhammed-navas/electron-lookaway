import { app, BrowserWindow, ipcMain, powerMonitor } from 'electron';
import { join } from 'path';
import { ContextHeuristics } from './contextHeuristics';
import { TrayManager } from './tray';
import { NotificationManager } from './notifications';
import { AutoLaunchManager } from './autoLaunch';
import { BreakEngine } from './breakEngine';
import { SettingsManager } from './settings';
import { OverlayWindow } from './overlayWindow';

class LookAwayApp {
  private mainWindow: BrowserWindow | null = null;
  private breakEngine: BreakEngine;
  private contextHeuristics: ContextHeuristics;
  private trayManager: TrayManager;
  private settingsManager: SettingsManager;
  private overlayWindow: OverlayWindow;
  private notificationManager: NotificationManager;
  private autoLaunchManager: AutoLaunchManager;

  constructor() {
    this.settingsManager = new SettingsManager();
    this.breakEngine = new BreakEngine(this.settingsManager);
    this.contextHeuristics = new ContextHeuristics(this.settingsManager);
    this.trayManager = new TrayManager(this.breakEngine, this.settingsManager);
    this.overlayWindow = new OverlayWindow();
    this.notificationManager = new NotificationManager();
    this.autoLaunchManager = new AutoLaunchManager();
  }

  async initialize(): Promise<void> {
    // Initialize settings and auto-launch
    await this.settingsManager.initialize();
    await this.autoLaunchManager.initialize();

    // Set up event listeners
    this.setupEventListeners();
    this.setupIpcHandlers();

    // Start the break engine
    this.breakEngine.start();

    // Create tray (app starts minimized to tray)
    this.trayManager.createTray();

    // Check if this is first run
    if (this.settingsManager.isFirstRun()) {
      this.showFirstRunWizard();
    }
  }

  private setupEventListeners(): void {
    // App lifecycle events
    app.on('window-all-closed', () => {
      // Don't quit the app when all windows are closed
      // Keep it running in the system tray
    });

    app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createSettingsWindow();
      }
    });

    // Power events
    powerMonitor.on('suspend', () => {
      this.breakEngine.pause();
    });

    powerMonitor.on('resume', () => {
      this.breakEngine.resume();
    });

    // Break engine events
    this.breakEngine.on('breakStart', (data: any) => {
      const duration = data?.duration || 20;
      this.notificationManager.showBreakNotification(duration);
      this.overlayWindow.showCountdown(duration);
    });

    this.breakEngine.on('breakEnd', () => {
      this.overlayWindow.hide();
      this.notificationManager.showBreakEndNotification();
    });

    this.breakEngine.on('countdownStart', (data: any) => {
      const seconds = data?.seconds || 10;
      this.notificationManager.showCountdownNotification(seconds);
    });

    // Context heuristics events
    this.contextHeuristics.on('contextChanged', (isPaused: boolean) => {
      if (isPaused) {
        this.breakEngine.pause();
      } else {
        this.breakEngine.resume();
      }
    });
  }

  private setupIpcHandlers(): void {
    // Settings window IPC handlers
    ipcMain.handle('settings:get', () => {
      return this.settingsManager.getAllSettings();
    });

    ipcMain.handle('settings:set', (_event: Electron.IpcMainInvokeEvent, key: string, value: any) => {
      this.settingsManager.setSetting(key as any, value);
      this.breakEngine.updateSettings();
      return true;
    });

    ipcMain.handle('settings:reset', () => {
      this.settingsManager.resetToDefaults();
      this.breakEngine.updateSettings();
      return true;
    });

    // Break engine IPC handlers
    ipcMain.handle('break:start', () => {
      this.breakEngine.start();
      return true;
    });

    ipcMain.handle('break:pause', () => {
      this.breakEngine.pause();
      return true;
    });

    ipcMain.handle('break:skip', () => {
      this.breakEngine.skip();
      return true;
    });

    ipcMain.handle('break:delay', (_event: Electron.IpcMainInvokeEvent, minutes: number) => {
      this.breakEngine.delay(minutes);
      return true;
    });

    ipcMain.handle('break:getStatus', () => {
      return this.breakEngine.getStatus();
    });

    // Auto-launch IPC handlers
    ipcMain.handle('autolaunch:get', () => {
      return this.autoLaunchManager.isEnabled();
    });

    ipcMain.handle('autolaunch:set', (_event: Electron.IpcMainInvokeEvent, enabled: boolean) => {
      return this.autoLaunchManager.setEnabled(enabled);
    });
  }

  private createSettingsWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 900,
      height: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'preload.js'),
      },
      icon: join(__dirname, '../assets/icon.png'),
      show: false,
    });

    // Load the settings page
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173/settings');
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/settings/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private showFirstRunWizard(): void {
    this.createSettingsWindow();
    // The settings window will show the first-run wizard
  }
}

// Initialize the app
const lookAwayApp = new LookAwayApp();

app.whenReady().then(() => {
  lookAwayApp.initialize();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    lookAwayApp.initialize();
  }
}); 
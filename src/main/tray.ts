import { Tray, Menu, app, BrowserWindow } from 'electron';
import { join } from 'path';
import { BreakEngine } from './breakEngine';
import { SettingsManager } from './settings';
import { BreakStatus } from '../shared/types';

export class TrayManager {
  private tray: Tray | null = null;
  private breakEngine: BreakEngine;
  private settingsManager: SettingsManager;
  private statusUpdateInterval: NodeJS.Timeout | null = null;

  constructor(breakEngine: BreakEngine, settingsManager: SettingsManager) {
    this.breakEngine = breakEngine;
    this.settingsManager = settingsManager;
  }

  createTray(): void {
    // Create tray icon
    const iconPath = join(__dirname, '../assets/tray-icon.png');
    this.tray = new Tray(iconPath);
    
    // Set initial tooltip
    this.updateTooltip();
    
    // Create context menu
    this.updateMenu();
    
    // Update status every 30 seconds
    this.statusUpdateInterval = setInterval(() => {
      this.updateTooltip();
      this.updateMenu();
    }, 30000);
    
    // Handle tray click
    this.tray.on('click', () => {
      this.showSettings();
    });
  }

  destroyTray(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
    
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }
  }

  private updateTooltip(): void {
    if (!this.tray) return;
    
    const status = this.breakEngine.getStatus();
    let tooltip = 'LookAway for Windows\n';
    
    if (status.isPaused) {
      tooltip += 'Paused';
    } else {
      switch (status.state) {
        case 'idle':
          if (status.nextBreakAt) {
            const timeUntilBreak = Math.max(0, status.nextBreakAt.getTime() - Date.now());
            const minutes = Math.floor(timeUntilBreak / (1000 * 60));
            tooltip += `Next break in ${minutes} minutes`;
          } else {
            tooltip += 'Ready';
          }
          break;
        case 'countdown':
          tooltip += `Break starting in ${status.timeRemaining} seconds`;
          break;
        case 'break':
          const minutes = Math.floor(status.timeRemaining / 60);
          const seconds = status.timeRemaining % 60;
          tooltip += `Break: ${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
          break;
        case 'overtime':
          tooltip += 'Break overtime';
          break;
      }
    }
    
    this.tray.setToolTip(tooltip);
  }

  private updateMenu(): void {
    if (!this.tray) return;
    
    const status = this.breakEngine.getStatus();
    const settings = this.settingsManager.getAllSettings();
    
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'LookAway for Windows',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: status.isPaused ? 'Resume' : 'Pause',
        click: () => {
          if (status.isPaused) {
            this.breakEngine.resume();
          } else {
            this.breakEngine.pause();
          }
        },
      },
      {
        label: 'Skip Current Break',
        enabled: status.state === 'break' || status.state === 'countdown',
        click: () => {
          this.breakEngine.skip();
        },
      },
      {
        label: 'Delay +5 minutes',
        enabled: status.state === 'countdown',
        click: () => {
          this.breakEngine.delay(5);
        },
      },
      { type: 'separator' },
      {
        label: 'Current Mode',
        submenu: this.createModeSubmenu(),
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          this.showSettings();
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ];
    
    const contextMenu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(contextMenu);
  }

  private createModeSubmenu(): Electron.MenuItemConstructorOptions[] {
    const presets = this.settingsManager.getModePresets();
    const currentSettings = this.settingsManager.getBreakSettings();
    
    return presets.map(preset => ({
      label: preset.name,
      type: 'radio',
      checked: this.isCurrentMode(preset, currentSettings),
      click: () => {
        this.settingsManager.applyModePreset(preset.name);
        this.breakEngine.updateSettings();
      },
    }));
  }

  private isCurrentMode(preset: any, currentSettings: any): boolean {
    // Simple comparison - in a real app you might want more sophisticated matching
    return preset.name === 'Balanced'; // Default to Balanced for now
  }

  private showSettings(): void {
    // Find existing settings window or create new one
    const existingWindow = BrowserWindow.getAllWindows().find(
      window => window.getTitle().includes('Settings')
    );
    
    if (existingWindow) {
      existingWindow.focus();
    } else {
      // This will be handled by the main process
      // For now, we'll emit an event that the main process can listen to
      this.emit('showSettings');
    }
  }

  // Event emitter methods for communication with main process
  private emit(event: string): void {
    // This would typically communicate with the main process
    // For now, we'll use a simple approach
    console.log(`Tray event: ${event}`);
  }
} 
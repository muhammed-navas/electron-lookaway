import { BrowserWindow, screen } from 'electron';
import { join } from 'path';

export class OverlayWindow {
  private window: BrowserWindow | null = null;
  private countdownInterval: NodeJS.Timeout | null = null;

  showCountdown(durationSeconds: number): void {
    this.createWindow();
    this.startCountdown(durationSeconds);
  }

  hide(): void {
    this.stopCountdown();
    if (this.window) {
      this.window.close();
      this.window = null;
    }
  }

  private createWindow(): void {
    if (this.window) {
      this.window.focus();
      return;
    }

    // Get cursor position
    const cursorPosition = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPosition);

    // Create overlay window
    this.window = new BrowserWindow({
      width: 200,
      height: 200,
      x: cursorPosition.x - 100,
      y: cursorPosition.y - 100,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      focusable: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'overlayPreload.js'),
      },
    });

    // Make window click-through
    this.window.setIgnoreMouseEvents(true);

    // Load overlay HTML
    this.window.loadFile(join(__dirname, '../renderer/overlay/index.html'));

    // Handle window close
    this.window.on('closed', () => {
      this.window = null;
    });
  }

  private startCountdown(durationSeconds: number): void {
    let remainingSeconds = durationSeconds;

    const updateCountdown = () => {
      if (this.window && !this.window.isDestroyed()) {
        this.window.webContents.send('update-countdown', {
          remaining: remainingSeconds,
          total: durationSeconds,
        });
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    this.countdownInterval = setInterval(() => {
      remainingSeconds--;
      updateCountdown();

      if (remainingSeconds <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
} 
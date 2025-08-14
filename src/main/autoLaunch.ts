const autoLaunch = require('auto-launch');

export class AutoLaunchManager {
  private autoLauncher: any = null;

  async initialize(): Promise<void> {
    this.autoLauncher = new autoLaunch({
      name: 'LookAway for Windows',
      path: process.execPath,
      isHidden: true,
    });
  }

  async isEnabled(): Promise<boolean> {
    if (!this.autoLauncher) {
      await this.initialize();
    }
    
    try {
      return await this.autoLauncher!.isEnabled();
    } catch (error) {
      console.error('Failed to check auto-launch status:', error);
      return false;
    }
  }

  async setEnabled(enabled: boolean): Promise<boolean> {
    if (!this.autoLauncher) {
      await this.initialize();
    }
    
    try {
      if (enabled) {
        await this.autoLauncher!.enable();
      } else {
        await this.autoLauncher!.disable();
      }
      return true;
    } catch (error) {
      console.error('Failed to set auto-launch:', error);
      return false;
    }
  }
} 
import { EventEmitter } from 'events';
import { powerMonitor, screen } from 'electron';
import activeWin from 'active-win';
import { ContextInfo, ActiveWindowInfo, AppSettings } from '../shared/types';
import { SettingsManager } from './settings';

export class ContextHeuristics extends EventEmitter {
  private settingsManager: SettingsManager;
  private settings: AppSettings;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastContextInfo: ContextInfo | null = null;
  private idleThreshold = 300; // 5 minutes in seconds

  constructor(settingsManager: SettingsManager) {
    super();
    this.settingsManager = settingsManager;
    this.settings = this.settingsManager.getAllSettings();
  }

  start(): void {
    if (this.pollingInterval) return;
    
    // Poll every 750ms as specified
    this.pollingInterval = setInterval(() => {
      this.checkContext();
    }, 750);
  }

  stop(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  updateSettings(): void {
    this.settings = this.settingsManager.getAllSettings();
  }

  private async checkContext(): Promise<void> {
    try {
      const contextInfo = await this.getContextInfo();
      const shouldPause = this.shouldPauseBreaks(contextInfo);
      
      // Only emit if context has changed
      if (!this.lastContextInfo || 
          this.lastContextInfo.shouldPause !== shouldPause) {
        this.lastContextInfo = contextInfo;
        this.emit('contextChanged', shouldPause);
      }
    } catch (error) {
      console.error('Error checking context:', error);
    }
  }

  private async getContextInfo(): Promise<ContextInfo> {
    const idleTime = powerMonitor.getSystemIdleTime();
    const isIdle = idleTime > this.idleThreshold;
    
    let activeWindowInfo: ActiveWindowInfo | null = null;
    try {
      const result = await activeWin();
      if (result && 'processName' in result && 'windowTitle' in result) {
        activeWindowInfo = result as ActiveWindowInfo;
      }
    } catch (error) {
      console.warn('Failed to get active window info:', error);
    }

    const isFullScreen = this.isFullScreen(activeWindowInfo);
    const activeProcess = activeWindowInfo?.processName || '';
    const activeWindowTitle = activeWindowInfo?.windowTitle || '';
    
    const isInFocusApp = this.isInFocusApp(activeProcess);
    const isInMeeting = this.isInMeeting(activeProcess, activeWindowTitle);
    
    const shouldPause = this.shouldPauseBreaks({
      isIdle,
      isFullScreen,
      activeProcess,
      activeWindowTitle,
      isInFocusApp,
      isInMeeting,
      shouldPause: false, // Will be calculated below
    });

    return {
      isIdle,
      isFullScreen,
      activeProcess,
      activeWindowTitle,
      isInFocusApp,
      isInMeeting,
      shouldPause,
    };
  }

  private shouldPauseBreaks(contextInfo: ContextInfo): boolean {
    // Pause if user is idle
    if (contextInfo.isIdle) {
      return true;
    }

    // Pause if in full-screen mode and settings require it
    if (contextInfo.isFullScreen && this.settings.fullScreenBehavior === 'pause') {
      return true;
    }

    // Pause if in focus app
    if (contextInfo.isInFocusApp) {
      return true;
    }

    // Pause if in meeting
    if (contextInfo.isInMeeting) {
      return true;
    }

    return false;
  }

  private isFullScreen(windowInfo: ActiveWindowInfo | null): boolean {
    if (!windowInfo) return false;

    const displays = screen.getAllDisplays();
    
    for (const display of displays) {
      const bounds = display.bounds;
      const windowBounds = windowInfo.bounds;
      
      // Check if window bounds match display bounds (with 10px tolerance)
      const tolerance = 10;
      const isFullScreenOnThisDisplay = 
        Math.abs(windowBounds.x - bounds.x) <= tolerance &&
        Math.abs(windowBounds.y - bounds.y) <= tolerance &&
        Math.abs(windowBounds.width - bounds.width) <= tolerance &&
        Math.abs(windowBounds.height - bounds.height) <= tolerance;
      
      if (isFullScreenOnThisDisplay) {
        return true;
      }
    }
    
    return false;
  }

  private isInFocusApp(processName: string): boolean {
    if (!processName) return false;
    
    const focusApps = this.settings.focusApps;
    return focusApps.some(app => 
      processName.toLowerCase().includes(app.toLowerCase().replace('.exe', ''))
    );
  }

  private isInMeeting(processName: string, windowTitle: string): boolean {
    if (!processName && !windowTitle) return false;
    
    const meetingKeywords = this.settings.meetingKeywords;
    const titleLower = windowTitle.toLowerCase();
    
    // Check for common meeting apps
    const meetingApps = ['zoom.exe', 'teams.exe', 'webex.exe', 'discord.exe', 'skype.exe'];
    const isMeetingApp = meetingApps.some(app => 
      processName.toLowerCase().includes(app.toLowerCase().replace('.exe', ''))
    );
    
    // Check for meeting keywords in window title
    const hasMeetingKeywords = meetingKeywords.some(keyword => 
      titleLower.includes(keyword.toLowerCase())
    );
    
    return isMeetingApp || hasMeetingKeywords;
  }

  // Override EventEmitter methods for proper typing
  on(event: 'contextChanged', listener: (shouldPause: boolean) => void): this {
    return super.on(event, listener);
  }

  emit(event: 'contextChanged', shouldPause: boolean): boolean {
    return super.emit(event, shouldPause);
  }
} 
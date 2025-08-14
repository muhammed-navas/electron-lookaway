import { EventEmitter } from 'events';
import { BreakSettings, BreakStatus, BreakEvent, BreakEventData } from '../shared/types';
import { SettingsManager } from './settings';

export class BreakEngine extends EventEmitter {
  private settingsManager: SettingsManager;
  private settings: BreakSettings;
  private status: BreakStatus;
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  constructor(settingsManager: SettingsManager) {
    super();
    this.settingsManager = settingsManager;
    this.settings = settingsManager.getBreakSettings();
    this.status = this.createInitialStatus();
  }

  private createInitialStatus(): BreakStatus {
    return {
      state: 'idle',
      timeRemaining: 0,
      nextBreakAt: null,
      isPaused: false,
      currentMode: 'Balanced',
      shortBreaksCompleted: 0,
      longBreaksCompleted: 0,
    };
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.scheduleNextBreak();
    this.emit('resume');
  }

  pause(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.status.isPaused = true;
    this.clearAllTimers();
    this.emit('pause');
  }

  resume(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.status.isPaused = false;
    this.scheduleNextBreak();
    this.emit('resume');
  }

  skip(): void {
    if (this.status.state === 'break') {
      this.endBreak();
    } else if (this.status.state === 'countdown') {
      this.cancelCountdown();
    }
    this.emit('skip');
  }

  delay(minutes: number): void {
    if (this.status.state === 'countdown') {
      this.cancelCountdown();
      this.scheduleNextBreak(minutes * 60 * 1000);
      this.emit('delay', { minutes });
    }
  }

  updateSettings(): void {
    this.settings = this.settingsManager.getBreakSettings();
    if (this.isRunning) {
      this.scheduleNextBreak();
    }
  }

  getStatus(): BreakStatus {
    return { ...this.status };
  }

  private scheduleNextBreak(delayMs = 0): void {
    const now = Date.now();
    const intervalMs = this.getCurrentInterval() * 60 * 1000;
    const nextBreakTime = now + intervalMs + delayMs;
    
    this.status.nextBreakAt = new Date(nextBreakTime);
    this.status.state = 'idle';
    
    const timer = setTimeout(() => {
      this.startCountdown();
    }, intervalMs + delayMs);
    
    this.timers.set('nextBreak', timer);
  }

  private getCurrentInterval(): number {
    const isLongBreak = (this.status.shortBreaksCompleted + 1) % this.settings.longBreakInterval === 0;
    return isLongBreak ? this.settings.longBreakDuration * 60 : this.settings.shortBreakInterval;
  }

  private startCountdown(): void {
    this.status.state = 'countdown';
    this.status.timeRemaining = this.settings.headsUpTime;
    
    this.emit('countdownStart', { seconds: this.settings.headsUpTime });
    
    const countdownTimer = setInterval(() => {
      this.status.timeRemaining--;
      
      if (this.status.timeRemaining <= 0) {
        this.startBreak();
        clearInterval(countdownTimer);
      }
    }, 1000);
    
    this.timers.set('countdown', countdownTimer);
  }

  private cancelCountdown(): void {
    const countdownTimer = this.timers.get('countdown');
    if (countdownTimer) {
      clearInterval(countdownTimer);
      this.timers.delete('countdown');
    }
    this.status.state = 'idle';
  }

  private startBreak(): void {
    const isLongBreak = (this.status.shortBreaksCompleted + 1) % this.settings.longBreakInterval === 0;
    const breakDuration = isLongBreak ? this.settings.longBreakDuration * 60 : this.settings.shortBreakDuration;
    
    this.status.state = 'break';
    this.status.timeRemaining = breakDuration;
    
    this.emit('breakStart', { duration: breakDuration });
    
    const breakTimer = setTimeout(() => {
      this.endBreak();
    }, breakDuration * 1000);
    
    this.timers.set('break', breakTimer);
  }

  private endBreak(): void {
    const breakTimer = this.timers.get('break');
    if (breakTimer) {
      clearTimeout(breakTimer);
      this.timers.delete('break');
    }
    
    const isLongBreak = (this.status.shortBreaksCompleted + 1) % this.settings.longBreakInterval === 0;
    
    if (isLongBreak) {
      this.status.longBreaksCompleted++;
      this.status.shortBreaksCompleted = 0;
    } else {
      this.status.shortBreaksCompleted++;
    }
    
    this.status.state = 'idle';
    this.emit('breakEnd');
    
    // Schedule next break
    this.scheduleNextBreak();
  }

  private clearAllTimers(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  // Override EventEmitter methods to provide proper typing
  on(event: BreakEvent, listener: (data?: BreakEventData[typeof event]) => void): this {
    return super.on(event, listener);
  }

  emit(event: BreakEvent, data?: BreakEventData[typeof event]): boolean {
    return super.emit(event, data);
  }
} 
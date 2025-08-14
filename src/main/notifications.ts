import { Notification } from 'electron';
import { join } from 'path';

export class NotificationManager {
  private soundEnabled = true;

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  showBreakNotification(durationSeconds: number): void {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    const timeString = minutes > 0 
      ? `${minutes}m ${seconds}s` 
      : `${seconds}s`;

    new Notification({
      title: 'LookAway - Break Time!',
      body: `Time for a ${timeString} break. Look away from your screen and focus on something 20 feet away.`,
      icon: join(__dirname, '../assets/icon.png'),
      silent: !this.soundEnabled,
    }).show();

    this.playBreakSound();
  }

  showBreakEndNotification(): void {
    new Notification({
      title: 'LookAway - Break Complete',
      body: 'Break time is over. You can return to your work.',
      icon: join(__dirname, '../assets/icon.png'),
      silent: !this.soundEnabled,
    }).show();

    this.playBreakEndSound();
  }

  showCountdownNotification(seconds: number): void {
    new Notification({
      title: 'LookAway - Break Starting Soon',
      body: `Your break will start in ${seconds} seconds.`,
      icon: join(__dirname, '../assets/icon.png'),
      silent: !this.soundEnabled,
    }).show();
  }

  showOvertimeNotification(): void {
    new Notification({
      title: 'LookAway - Break Overdue',
      body: 'Your break time has passed. Please take your break now.',
      icon: join(__dirname, '../assets/icon.png'),
      silent: false, // Always play sound for overtime
    }).show();

    this.playOvertimeSound();
  }

  private playBreakSound(): void {
    if (!this.soundEnabled) return;
    
    // In a real implementation, you would play an audio file
    // For now, we'll use the system notification sound
    console.log('Playing break sound');
  }

  private playBreakEndSound(): void {
    if (!this.soundEnabled) return;
    
    console.log('Playing break end sound');
  }

  private playOvertimeSound(): void {
    // Always play overtime sound
    console.log('Playing overtime sound');
  }
} 
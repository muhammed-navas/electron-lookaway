export interface BreakSettings {
  shortBreakInterval: number; // minutes
  shortBreakDuration: number; // seconds
  longBreakInterval: number; // number of short breaks before long break
  longBreakDuration: number; // minutes
  headsUpTime: number; // seconds before break
  skipPolicy: 'casual' | 'balanced' | 'hardcore';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  overlayEnabled: boolean;
}

export interface ModePreset {
  name: string;
  description: string;
  settings: Partial<BreakSettings>;
}

export interface AppSettings {
  break: BreakSettings;
  focusApps: string[]; // process names to pause breaks for
  meetingKeywords: string[]; // keywords to detect meetings
  fullScreenBehavior: 'pause' | 'continue';
  autoLaunch: boolean;
  theme: 'light' | 'dark' | 'system';
  firstRun: boolean;
}

export interface BreakStatus {
  state: 'idle' | 'countdown' | 'break' | 'overtime';
  timeRemaining: number; // seconds
  nextBreakAt: Date | null;
  isPaused: boolean;
  currentMode: string;
  shortBreaksCompleted: number;
  longBreaksCompleted: number;
}

export interface ContextInfo {
  isIdle: boolean;
  isFullScreen: boolean;
  activeProcess: string;
  activeWindowTitle: string;
  isInFocusApp: boolean;
  isInMeeting: boolean;
  shouldPause: boolean;
}

export interface ActiveWindowInfo {
  processName: string;
  windowTitle: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type BreakEvent = 
  | 'breakStart'
  | 'breakEnd'
  | 'countdownStart'
  | 'pause'
  | 'resume'
  | 'skip'
  | 'delay';

export interface BreakEventData {
  breakStart?: { duration: number };
  breakEnd?: {};
  countdownStart?: { seconds: number };
  pause?: {};
  resume?: {};
  skip?: {};
  delay?: { minutes: number };
} 
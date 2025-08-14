import Store from 'electron-store';
import { AppSettings, BreakSettings, ModePreset } from '../shared/types';

const DEFAULT_BREAK_SETTINGS: BreakSettings = {
  shortBreakInterval: 20, // 20 minutes
  shortBreakDuration: 20, // 20 seconds
  longBreakInterval: 4, // every 4 short breaks
  longBreakDuration: 5, // 5 minutes
  headsUpTime: 10, // 10 seconds
  skipPolicy: 'balanced',
  soundEnabled: true,
  notificationsEnabled: true,
  overlayEnabled: true,
};

const MODE_PRESETS: ModePreset[] = [
  {
    name: 'Balanced',
    description: 'Standard 20-20-20 rule with balanced breaks',
    settings: DEFAULT_BREAK_SETTINGS,
  },
  {
    name: 'Deep Focus',
    description: 'Longer intervals for deep work sessions',
    settings: {
      shortBreakInterval: 45,
      shortBreakDuration: 15,
      longBreakInterval: 3,
      longBreakDuration: 10,
      skipPolicy: 'hardcore',
    },
  },
  {
    name: 'Eye Care',
    description: 'Frequent short breaks for eye health',
    settings: {
      shortBreakInterval: 15,
      shortBreakDuration: 30,
      longBreakInterval: 6,
      longBreakDuration: 3,
      skipPolicy: 'casual',
    },
  },
  {
    name: 'Wellness',
    description: 'Comprehensive wellness breaks',
    settings: {
      shortBreakInterval: 30,
      shortBreakDuration: 60,
      longBreakInterval: 2,
      longBreakDuration: 15,
      skipPolicy: 'balanced',
    },
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  break: DEFAULT_BREAK_SETTINGS,
  focusApps: ['code.exe', 'devenv.exe', 'notepad++.exe', 'sublime_text.exe'],
  meetingKeywords: ['meeting', 'call', 'zoom', 'teams', 'webex', 'discord'],
  fullScreenBehavior: 'pause',
  autoLaunch: false,
  theme: 'system',
  firstRun: true,
};

export class SettingsManager {
  private store: Store<AppSettings>;

  constructor() {
    this.store = new Store<AppSettings>({
      name: 'lookaway-settings',
      defaults: DEFAULT_SETTINGS,
    });
  }

  async initialize(): Promise<void> {
    // Ensure all required settings exist
    const currentSettings = this.store.store;
    const mergedSettings = this.mergeWithDefaults(currentSettings);
    this.store.store = mergedSettings;
  }

  private mergeWithDefaults(settings: Partial<AppSettings>): AppSettings {
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      break: {
        ...DEFAULT_SETTINGS.break,
        ...settings.break,
      },
    };
  }

  getAllSettings(): AppSettings {
    return this.store.store;
  }

  getBreakSettings(): BreakSettings {
    return this.store.store.break;
  }

  setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.store.set(key, value);
  }

  setBreakSetting<K extends keyof BreakSettings>(key: K, value: BreakSettings[K]): void {
    const currentBreak = this.store.store.break;
    this.store.set('break', { ...currentBreak, [key]: value });
  }

  getModePresets(): ModePreset[] {
    return MODE_PRESETS;
  }

  applyModePreset(presetName: string): void {
    const preset = MODE_PRESETS.find(p => p.name === presetName);
    if (preset) {
      const currentBreak = this.store.store.break;
      this.store.set('break', { ...currentBreak, ...preset.settings });
    }
  }

  resetToDefaults(): void {
    this.store.clear();
    this.store.store = DEFAULT_SETTINGS;
  }

  isFirstRun(): boolean {
    return this.store.store.firstRun;
  }

  setFirstRunComplete(): void {
    this.store.set('firstRun', false);
  }

  exportSettings(): string {
    return JSON.stringify(this.store.store, null, 2);
  }

  importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson) as AppSettings;
      this.store.store = this.mergeWithDefaults(settings);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }

  getFocusApps(): string[] {
    return this.store.store.focusApps;
  }

  addFocusApp(appName: string): void {
    const currentApps = this.getFocusApps();
    if (!currentApps.includes(appName)) {
      this.store.set('focusApps', [...currentApps, appName]);
    }
  }

  removeFocusApp(appName: string): void {
    const currentApps = this.getFocusApps();
    this.store.set('focusApps', currentApps.filter(app => app !== appName));
  }

  getMeetingKeywords(): string[] {
    return this.store.store.meetingKeywords;
  }

  addMeetingKeyword(keyword: string): void {
    const currentKeywords = this.getMeetingKeywords();
    if (!currentKeywords.includes(keyword)) {
      this.store.set('meetingKeywords', [...currentKeywords, keyword]);
    }
  }

  removeMeetingKeyword(keyword: string): void {
    const currentKeywords = this.getMeetingKeywords();
    this.store.set('meetingKeywords', currentKeywords.filter(k => k !== keyword));
  }
} 
import { contextBridge, ipcRenderer } from 'electron';
import { AppSettings, BreakStatus } from '../shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  setSetting: (key: string, value: any): Promise<boolean> => ipcRenderer.invoke('settings:set', key, value),
  resetSettings: (): Promise<boolean> => ipcRenderer.invoke('settings:reset'),
  
  // Break engine
  startBreak: (): Promise<boolean> => ipcRenderer.invoke('break:start'),
  pauseBreak: (): Promise<boolean> => ipcRenderer.invoke('break:pause'),
  skipBreak: (): Promise<boolean> => ipcRenderer.invoke('break:skip'),
  delayBreak: (minutes: number): Promise<boolean> => ipcRenderer.invoke('break:delay', minutes),
  getBreakStatus: (): Promise<BreakStatus> => ipcRenderer.invoke('break:getStatus'),
  
  // Auto-launch
  getAutoLaunch: (): Promise<boolean> => ipcRenderer.invoke('autolaunch:get'),
  setAutoLaunch: (enabled: boolean): Promise<boolean> => ipcRenderer.invoke('autolaunch:set', enabled),
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getSettings(): Promise<AppSettings>;
      setSetting(key: string, value: any): Promise<boolean>;
      resetSettings(): Promise<boolean>;
      startBreak(): Promise<boolean>;
      pauseBreak(): Promise<boolean>;
      skipBreak(): Promise<boolean>;
      delayBreak(minutes: number): Promise<boolean>;
      getBreakStatus(): Promise<BreakStatus>;
      getAutoLaunch(): Promise<boolean>;
      setAutoLaunch(enabled: boolean): Promise<boolean>;
    };
  }
} 
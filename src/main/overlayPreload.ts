import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods for the overlay window
contextBridge.exposeInMainWorld('overlayAPI', {
  onCountdownUpdate: (callback: (data: { remaining: number; total: number }) => void) => {
    ipcRenderer.on('update-countdown', (_event: Electron.IpcRendererEvent, data: { remaining: number; total: number }) => callback(data));
  },
});

// Type definitions for the overlay API
declare global {
  interface Window {
    overlayAPI: {
      onCountdownUpdate(callback: (data: { remaining: number; total: number }) => void): void;
    };
  }
} 
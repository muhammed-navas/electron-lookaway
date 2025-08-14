// Type declarations for Electron and other dependencies
declare module 'electron' {
  export * from 'electron';
}

declare module 'active-win' {
  interface ActiveWindowInfo {
    processName: string;
    windowTitle: string;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
  
  function activeWin(): Promise<ActiveWindowInfo>;
  export = activeWin;
}

declare module 'electron-store' {
  class Store<T = any> {
    constructor(options?: any);
    get(key: string, defaultValue?: any): T;
    set(key: string, value: any): void;
    store: T;
    clear(): void;
  }
  export = Store;
}

declare module 'auto-launch' {
  class AutoLaunch {
    constructor(options: any);
    enable(): Promise<void>;
    disable(): Promise<void>;
    isEnabled(): Promise<boolean>;
  }
  const autoLaunch: typeof AutoLaunch;
  export default autoLaunch;
}

// iohook removed - using alternative methods for input detection

// node-notifier removed - using Electron's built-in Notification

declare module 'open' {
  function open(target: string): Promise<any>;
  export = open;
}

declare module 'is-elevated' {
  function isElevated(): boolean;
  export = isElevated;
}

// winreg removed - using alternative registry access methods

declare module 'systeminformation' {
  const si: any;
  export = si;
}

declare module 'semver' {
  function satisfies(version: string, range: string): boolean;
  function valid(version: string): string | null;
  export { satisfies, valid };
} 
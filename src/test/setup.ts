// Test setup file for Jest

// Mock Electron APIs
(global as any).window = {
  electronAPI: {
    getSettings: () => Promise.resolve({}),
    setSetting: () => Promise.resolve(true),
    resetSettings: () => Promise.resolve(true),
    startBreak: () => Promise.resolve(true),
    pauseBreak: () => Promise.resolve(true),
    skipBreak: () => Promise.resolve(true),
    delayBreak: () => Promise.resolve(true),
    getBreakStatus: () => Promise.resolve({}),
    getAutoLaunch: () => Promise.resolve(false),
    setAutoLaunch: () => Promise.resolve(true),
  },
};

// Mock console methods to reduce noise in tests
(global as any).console = {
  ...console,
  log: () => {},
  warn: () => {},
  error: () => {},
}; 
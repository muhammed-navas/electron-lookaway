import React, { useState, useEffect } from 'react';
import { AppSettings, BreakSettings } from '../../shared/types';
import { BreakSettingsPanel } from './components/BreakSettingsPanel';
import { FocusAppsPanel } from './components/FocusAppsPanel';
import { GeneralSettingsPanel } from './components/GeneralSettingsPanel';
import { StatusPanel } from './components/StatusPanel';

export const SettingsApp: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeTab, setActiveTab] = useState('break');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const appSettings = await window.electronAPI.getSettings();
      setSettings(appSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    if (!settings) return;

    try {
      await window.electronAPI.setSetting(key, value);
      setSettings({ ...settings, [key]: value });
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const updateBreakSetting = async (key: keyof BreakSettings, value: any) => {
    if (!settings) return;

    try {
      await window.electronAPI.setSetting('break', {
        ...settings.break,
        [key]: value,
      });
      setSettings({
        ...settings,
        break: { ...settings.break, [key]: value },
      });
    } catch (error) {
      console.error('Failed to update break setting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="error">
        <p>Failed to load settings</p>
        <button onClick={loadSettings}>Retry</button>
      </div>
    );
  }

  return (
    <div className="settings-app">
      <header className="header">
        <h1>LookAway for Windows</h1>
        <p>Context-aware break reminders</p>
      </header>

      <div className="content">
        <nav className="tabs">
          <button
            className={activeTab === 'break' ? 'active' : ''}
            onClick={() => setActiveTab('break')}
          >
            Break Settings
          </button>
          <button
            className={activeTab === 'focus' ? 'active' : ''}
            onClick={() => setActiveTab('focus')}
          >
            Focus Apps
          </button>
          <button
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={activeTab === 'status' ? 'active' : ''}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
        </nav>

        <main className="tab-content">
          {activeTab === 'break' && (
            <BreakSettingsPanel
              settings={settings.break}
              onUpdate={updateBreakSetting}
            />
          )}
          {activeTab === 'focus' && (
            <FocusAppsPanel
              focusApps={settings.focusApps}
              meetingKeywords={settings.meetingKeywords}
              onUpdateFocusApps={(apps) => updateSetting('focusApps', apps)}
              onUpdateMeetingKeywords={(keywords) => updateSetting('meetingKeywords', keywords)}
            />
          )}
          {activeTab === 'general' && (
            <GeneralSettingsPanel
              settings={settings}
              onUpdate={updateSetting}
            />
          )}
          {activeTab === 'status' && (
            <StatusPanel />
          )}
        </main>
      </div>
    </div>
  );
}; 
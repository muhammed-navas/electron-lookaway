import React from 'react';
import { AppSettings } from '../../../shared/types';

interface GeneralSettingsPanelProps {
  settings: AppSettings;
  onUpdate: (key: keyof AppSettings, value: any) => void;
}

export const GeneralSettingsPanel: React.FC<GeneralSettingsPanelProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <div className="settings-panel">
      <h2>General Settings</h2>
      
      <div className="setting-group">
        <h3>Startup</h3>
        <div className="setting-row">
          <label>
            <input
              type="checkbox"
              checked={settings.autoLaunch}
              onChange={(e) => onUpdate('autoLaunch', e.target.checked)}
            />
            Start LookAway automatically when Windows starts
          </label>
        </div>
      </div>

      <div className="setting-group">
        <h3>Full-Screen Behavior</h3>
        <div className="setting-row">
          <label htmlFor="fullScreenBehavior">When full-screen apps are active:</label>
          <select
            id="fullScreenBehavior"
            value={settings.fullScreenBehavior}
            onChange={(e) => onUpdate('fullScreenBehavior', e.target.value)}
          >
            <option value="pause">Pause breaks</option>
            <option value="continue">Continue breaks</option>
          </select>
        </div>
      </div>

      <div className="setting-group">
        <h3>Theme</h3>
        <div className="setting-row">
          <label htmlFor="theme">Theme:</label>
          <select
            id="theme"
            value={settings.theme}
            onChange={(e) => onUpdate('theme', e.target.value)}
          >
            <option value="system">System default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="setting-group">
        <h3>Data & Privacy</h3>
        <div className="setting-row">
          <p>All settings are stored locally on your computer. No data is sent to external servers.</p>
        </div>
        <div className="setting-row">
          <button onClick={() => exportSettings()}>Export Settings</button>
          <button onClick={() => importSettings()}>Import Settings</button>
        </div>
        <div className="setting-row">
          <button onClick={() => resetSettings()} className="danger">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );

  async function exportSettings() {
    try {
      const settingsData = await window.electronAPI.getSettings();
      const blob = new Blob([JSON.stringify(settingsData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lookaway-settings.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export settings:', error);
    }
  }

  async function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const settingsData = JSON.parse(text);
          // Note: In a real implementation, you'd validate the settings data
          // and update the settings through the main process
          console.log('Import settings:', settingsData);
        } catch (error) {
          console.error('Failed to import settings:', error);
        }
      }
    };
    input.click();
  }

  async function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      try {
        await window.electronAPI.resetSettings();
        // Reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset settings:', error);
      }
    }
  }
}; 
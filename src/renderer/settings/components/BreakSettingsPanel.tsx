import React from 'react';
import { BreakSettings } from '../../../shared/types';

interface BreakSettingsPanelProps {
  settings: BreakSettings;
  onUpdate: (key: keyof BreakSettings, value: any) => void;
}

export const BreakSettingsPanel: React.FC<BreakSettingsPanelProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <div className="settings-panel">
      <h2>Break Settings</h2>
      
      <div className="setting-group">
        <h3>Short Breaks</h3>
        <div className="setting-row">
          <label htmlFor="shortBreakInterval">Interval (minutes):</label>
          <input
            id="shortBreakInterval"
            type="number"
            min="1"
            max="120"
            value={settings.shortBreakInterval}
            onChange={(e) => onUpdate('shortBreakInterval', parseInt(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <label htmlFor="shortBreakDuration">Duration (seconds):</label>
          <input
            id="shortBreakDuration"
            type="number"
            min="5"
            max="300"
            value={settings.shortBreakDuration}
            onChange={(e) => onUpdate('shortBreakDuration', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="setting-group">
        <h3>Long Breaks</h3>
        <div className="setting-row">
          <label htmlFor="longBreakInterval">Every N short breaks:</label>
          <input
            id="longBreakInterval"
            type="number"
            min="1"
            max="20"
            value={settings.longBreakInterval}
            onChange={(e) => onUpdate('longBreakInterval', parseInt(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <label htmlFor="longBreakDuration">Duration (minutes):</label>
          <input
            id="longBreakDuration"
            type="number"
            min="1"
            max="60"
            value={settings.longBreakDuration}
            onChange={(e) => onUpdate('longBreakDuration', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="setting-group">
        <h3>Notifications</h3>
        <div className="setting-row">
          <label htmlFor="headsUpTime">Heads-up time (seconds):</label>
          <input
            id="headsUpTime"
            type="number"
            min="0"
            max="60"
            value={settings.headsUpTime}
            onChange={(e) => onUpdate('headsUpTime', parseInt(e.target.value))}
          />
        </div>
        <div className="setting-row">
          <label>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdate('soundEnabled', e.target.checked)}
            />
            Enable sounds
          </label>
        </div>
        <div className="setting-row">
          <label>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => onUpdate('notificationsEnabled', e.target.checked)}
            />
            Enable notifications
          </label>
        </div>
        <div className="setting-row">
          <label>
            <input
              type="checkbox"
              checked={settings.overlayEnabled}
              onChange={(e) => onUpdate('overlayEnabled', e.target.checked)}
            />
            Show overlay countdown
          </label>
        </div>
      </div>

      <div className="setting-group">
        <h3>Skip Policy</h3>
        <div className="setting-row">
          <label htmlFor="skipPolicy">Policy:</label>
          <select
            id="skipPolicy"
            value={settings.skipPolicy}
            onChange={(e) => onUpdate('skipPolicy', e.target.value)}
          >
            <option value="casual">Casual (skip allowed)</option>
            <option value="balanced">Balanced (delay only)</option>
            <option value="hardcore">Hardcore (no skip)</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 
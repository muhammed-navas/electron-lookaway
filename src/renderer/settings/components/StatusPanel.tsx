import React, { useState, useEffect } from 'react';
import { BreakStatus } from '../../../shared/types';

export const StatusPanel: React.FC = () => {
  const [status, setStatus] = useState<BreakStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const breakStatus = await window.electronAPI.getBreakStatus();
      setStatus(breakStatus);
    } catch (error) {
      console.error('Failed to load status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNextBreak = (date: Date | null): string => {
    if (!date) return 'Not scheduled';
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minutes`;
  };

  if (isLoading) {
    return (
      <div className="settings-panel">
        <h2>Status</h2>
        <div className="loading">Loading status...</div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="settings-panel">
        <h2>Status</h2>
        <div className="error">Failed to load status</div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <h2>Status</h2>
      
      <div className="status-grid">
        <div className="status-item">
          <h3>Current State</h3>
          <div className={`status-badge ${status.state}`}>
            {status.state.charAt(0).toUpperCase() + status.state.slice(1)}
          </div>
        </div>

        <div className="status-item">
          <h3>Time Remaining</h3>
          <div className="time-display">
            {status.timeRemaining > 0 ? formatTime(status.timeRemaining) : '--:--'}
          </div>
        </div>

        <div className="status-item">
          <h3>Next Break</h3>
          <div className="next-break">
            {formatNextBreak(status.nextBreakAt)}
          </div>
        </div>

        <div className="status-item">
          <h3>Paused</h3>
          <div className={`status-badge ${status.isPaused ? 'paused' : 'running'}`}>
            {status.isPaused ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <h3>Short Breaks Completed</h3>
          <div className="stat-value">{status.shortBreaksCompleted}</div>
        </div>

        <div className="stat-item">
          <h3>Long Breaks Completed</h3>
          <div className="stat-value">{status.longBreaksCompleted}</div>
        </div>
      </div>

      <div className="controls">
        <h3>Controls</h3>
        <div className="control-buttons">
          {status.isPaused ? (
            <button onClick={() => window.electronAPI.startBreak()}>
              Resume
            </button>
          ) : (
            <button onClick={() => window.electronAPI.pauseBreak()}>
              Pause
            </button>
          )}
          
          {(status.state === 'break' || status.state === 'countdown') && (
            <button onClick={() => window.electronAPI.skipBreak()}>
              Skip
            </button>
          )}
          
          {status.state === 'countdown' && (
            <button onClick={() => window.electronAPI.delayBreak(5)}>
              Delay +5min
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 
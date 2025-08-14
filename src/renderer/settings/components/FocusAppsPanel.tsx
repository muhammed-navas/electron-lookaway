import React, { useState } from 'react';

interface FocusAppsPanelProps {
  focusApps: string[];
  meetingKeywords: string[];
  onUpdateFocusApps: (apps: string[]) => void;
  onUpdateMeetingKeywords: (keywords: string[]) => void;
}

export const FocusAppsPanel: React.FC<FocusAppsPanelProps> = ({
  focusApps,
  meetingKeywords,
  onUpdateFocusApps,
  onUpdateMeetingKeywords,
}) => {
  const [newFocusApp, setNewFocusApp] = useState('');
  const [newMeetingKeyword, setNewMeetingKeyword] = useState('');

  const addFocusApp = () => {
    if (newFocusApp.trim() && !focusApps.includes(newFocusApp.trim())) {
      onUpdateFocusApps([...focusApps, newFocusApp.trim()]);
      setNewFocusApp('');
    }
  };

  const removeFocusApp = (app: string) => {
    onUpdateFocusApps(focusApps.filter(a => a !== app));
  };

  const addMeetingKeyword = () => {
    if (newMeetingKeyword.trim() && !meetingKeywords.includes(newMeetingKeyword.trim())) {
      onUpdateMeetingKeywords([...meetingKeywords, newMeetingKeyword.trim()]);
      setNewMeetingKeyword('');
    }
  };

  const removeMeetingKeyword = (keyword: string) => {
    onUpdateMeetingKeywords(meetingKeywords.filter(k => k !== keyword));
  };

  return (
    <div className="settings-panel">
      <h2>Focus Apps & Meetings</h2>
      
      <div className="setting-group">
        <h3>Focus Apps</h3>
        <p>Breaks will be paused when these applications are active:</p>
        
        <div className="add-item">
          <input
            type="text"
            placeholder="Enter app name (e.g., code.exe)"
            value={newFocusApp}
            onChange={(e) => setNewFocusApp(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addFocusApp()}
          />
          <button onClick={addFocusApp}>Add</button>
        </div>

        <div className="item-list">
          {focusApps.map((app) => (
            <div key={app} className="item">
              <span>{app}</span>
              <button onClick={() => removeFocusApp(app)}>Remove</button>
            </div>
          ))}
          {focusApps.length === 0 && (
            <p className="empty-message">No focus apps configured</p>
          )}
        </div>
      </div>

      <div className="setting-group">
        <h3>Meeting Keywords</h3>
        <p>Breaks will be paused when window titles contain these keywords:</p>
        
        <div className="add-item">
          <input
            type="text"
            placeholder="Enter keyword (e.g., meeting, call)"
            value={newMeetingKeyword}
            onChange={(e) => setNewMeetingKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMeetingKeyword()}
          />
          <button onClick={addMeetingKeyword}>Add</button>
        </div>

        <div className="item-list">
          {meetingKeywords.map((keyword) => (
            <div key={keyword} className="item">
              <span>{keyword}</span>
              <button onClick={() => removeMeetingKeyword(keyword)}>Remove</button>
            </div>
          ))}
          {meetingKeywords.length === 0 && (
            <p className="empty-message">No meeting keywords configured</p>
          )}
        </div>
      </div>
    </div>
  );
}; 
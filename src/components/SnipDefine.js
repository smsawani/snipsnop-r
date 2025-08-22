import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import snipService from '../services/snipService';
import '../style.css';

const SnipDefine = () => {
  const location = useLocation();
  const episodeData = location.state || {};
  
  const {
    episodeUrl,
    trackId,
    trackName,
    collectionName
  } = episodeData;

  // State for start and end times
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Load saved times from Redis on component mount
  useEffect(() => {
    const loadSavedSnip = async () => {
      if (trackId) {
        try {
          const savedData = await snipService.getSnip(trackId);
          if (savedData) {
            setStartTime(savedData.startTime || '');
            setEndTime(savedData.endTime || '');
            setIsSaved(!!(savedData.startTime || savedData.endTime));
          }
        } catch (error) {
          console.error('Error loading saved snip data:', error);
        }
      }
    };
    
    loadSavedSnip();
  }, [trackId]);

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
    setIsSaved(false);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
    setIsSaved(false);
  };

  // Save times to Redis
  const handleSave = async () => {
    if (trackId && (startTime || endTime)) {
      try {
        const snipData = {
          startTime,
          endTime,
          episodeData
        };
        await snipService.saveSnip(trackId, snipData);
        setIsSaved(true);
      } catch (error) {
        console.error('Error saving snip:', error);
        alert('Failed to save snip. Please try again.');
      }
    }
  };

  // Convert time string (MM:SS or HH:MM:SS) to seconds
  const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(num => parseInt(num, 10));
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // MM:SS
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
    }
    return 0;
  };

  console.log(JSON.stringify(episodeData));

  return (      
    <div className="snip-define-container">
      <div className="snip-define-nav">
        <Link to="/" className="button fancy-button">
          ← Search Podcasts
        </Link>
        <Link to="/snips" className="button fancy-button">
          My Snips
        </Link>
      </div>

      <div className="episode-header">
        <h2 className="episode-title">{trackName}</h2>
        <p className="podcast-name">{collectionName}</p>
      </div>

      <div className="audio-player-section">
        <audio id="player" controls className="audio-player">
          <source id="player-source" src={episodeUrl} type="audio/mpeg"/>
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className="time-inputs-section">
        <h3>Define Snip Times</h3>
        
        <div className="time-input-group">
          <div className="time-input-field">
            <label htmlFor="start-time">Start Time</label>
            <input
              id="start-time"
              type="text"
              value={startTime}
              onChange={handleStartTimeChange}
              placeholder="MM:SS or HH:MM:SS"
              className="time-input"
            />
          </div>

          <div className="time-input-field">
            <label htmlFor="end-time">End Time</label>
            <input
              id="end-time"
              type="text"
              value={endTime}
              onChange={handleEndTimeChange}
              placeholder="MM:SS or HH:MM:SS"
              className="time-input"
            />
          </div>
        </div>

        <div className="save-button-container">
          <button 
            type="button" 
            className={`button save-button ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={!startTime && !endTime}
          >
            {isSaved ? 'Saved ✓' : 'Save Snip Times'}
          </button>
        </div>

        {(startTime || endTime) && (
          <div className="snip-summary">
            <h4>Current Snip</h4>
            <p>
              <strong>Duration:</strong> {startTime} - {endTime}
              {startTime && endTime && (
                <span className="duration-calc">
                  {' '}({Math.max(0, timeToSeconds(endTime) - timeToSeconds(startTime))}s)
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="debug-section">
        <details>
          <summary>Debug Info</summary>
          <pre className="debug-data">
            {JSON.stringify(episodeData, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default SnipDefine;
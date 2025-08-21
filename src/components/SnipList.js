import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

const SnipList = () => {
  const [snips, setSnips] = useState([]);
  const [playingSnip, setPlayingSnip] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const timeUpdateInterval = useRef(null);

  useEffect(() => {
    loadSnips();
  }, []);

  const loadSnips = () => {
    const snipItems = [];
    
    // Iterate through all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Only process keys that start with 'snip_'
      if (key && key.startsWith('snip_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const trackId = key.replace('snip_', '');
          
          snipItems.push({
            trackId,
            ...data,
            storageKey: key
          });
        } catch (error) {
          console.error(`Error parsing snip data for ${key}:`, error);
        }
      }
    }
    
    // Sort by lastModified date (most recent first)
    snipItems.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    setSnips(snipItems);
  };

  const deleteSnip = (storageKey) => {
    if (window.confirm('Are you sure you want to delete this snip?')) {
      localStorage.removeItem(storageKey);
      loadSnips(); // Reload the list
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Convert time string to seconds
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

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return null;
    const duration = Math.max(0, timeToSeconds(endTime) - timeToSeconds(startTime));
    return duration;
  };

  // Audio playback controls
  const playSnip = (snip) => {
    if (!snip.episodeData?.episodeUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    const startSeconds = timeToSeconds(snip.startTime);
    const endSeconds = timeToSeconds(snip.endTime);

    if (playingSnip?.trackId === snip.trackId) {
      // Already playing this snip, just toggle play/pause
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    // Stop any currently playing audio
    audio.pause();
    
    // Set new audio source and play
    audio.src = snip.episodeData.episodeUrl;
    audio.currentTime = startSeconds;
    setPlayingSnip(snip);
    setCurrentTime(startSeconds);

    // Start playing
    audio.play().then(() => {
      // Set up interval to check playback progress
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
      
      timeUpdateInterval.current = setInterval(() => {
        const current = audio.currentTime;
        setCurrentTime(current);
        
        // Stop at end time if specified
        if (endSeconds > startSeconds && current >= endSeconds) {
          audio.pause();
          setPlayingSnip(null);
          clearInterval(timeUpdateInterval.current);
        }
      }, 100);
    }).catch(error => {
      console.error('Error playing audio:', error);
      setPlayingSnip(null);
    });
  };

  const stopSnip = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setPlayingSnip(null);
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, []);

  const getPlaybackProgress = (snip) => {
    if (playingSnip?.trackId !== snip.trackId) return 0;
    
    const startSeconds = timeToSeconds(snip.startTime);
    const endSeconds = timeToSeconds(snip.endTime);
    const duration = endSeconds - startSeconds;
    
    if (duration <= 0) return 0;
    
    const progress = (currentTime - startSeconds) / duration;
    return Math.max(0, Math.min(1, progress));
  };

  const isPlaying = (snip) => {
    return playingSnip?.trackId === snip.trackId && audioRef.current && !audioRef.current.paused;
  };

  return (
    <div className="snip-list-container">
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      <div className="snip-list-header">
        <h1>My Snips</h1>
        <p className="snip-count">{snips.length} saved snip{snips.length !== 1 ? 's' : ''}</p>
      </div>

      {snips.length === 0 ? (
        <div className="empty-state">
          <h3>No snips saved yet</h3>
          <p>Start by searching for podcasts and defining your first snip!</p>
          <Link to="/" className="button">
            Search Podcasts
          </Link>
        </div>
      ) : (
        <div className="snips-grid">
          {snips.map((snip) => (
            <div key={snip.storageKey} className="snip-card">
              <div className="snip-card-header">
                <div className="snip-episode-info">
                  {snip.episodeData?.artworkUrl && (
                    <img 
                      src={snip.episodeData.artworkUrl} 
                      alt={snip.episodeData.trackName} 
                      className="snip-artwork"
                    />
                  )}
                  <div className="snip-text-info">
                    <h3 className="snip-episode-title">
                      {snip.episodeData?.trackName || 'Unknown Episode'}
                    </h3>
                    <p className="snip-podcast-name">
                      {snip.episodeData?.collectionName || 'Unknown Podcast'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="snip-times">
                <div className="snip-time-range">
                  <strong>Snip:</strong> {snip.startTime || '--:--'} - {snip.endTime || '--:--'}
                  {snip.startTime && snip.endTime && (
                    <span className="snip-duration">
                      {' '}({calculateDuration(snip.startTime, snip.endTime)}s)
                    </span>
                  )}
                </div>
                <div className="snip-saved-date">
                  Saved: {formatDate(snip.lastModified)}
                </div>
              </div>

              {snip.episodeData?.episodeUrl && snip.startTime && snip.endTime && (
                <div className="snip-playback">
                  <div className="snip-controls">
                    <button 
                      className={`snip-play-button ${isPlaying(snip) ? 'playing' : ''}`}
                      onClick={() => playSnip(snip)}
                      title={isPlaying(snip) ? 'Pause' : 'Play snip'}
                    >
                      {isPlaying(snip) ? '⏸️' : '▶️'}
                    </button>
                    
                    {playingSnip?.trackId === snip.trackId && (
                      <button 
                        className="snip-stop-button"
                        onClick={stopSnip}
                        title="Stop"
                      >
                        ⏹️
                      </button>
                    )}
                    
                    <span className="snip-controls-label">
                      {isPlaying(snip) ? 'Playing snip...' : 'Play snip'}
                    </span>
                  </div>
                  
                  {playingSnip?.trackId === snip.trackId && (
                    <div className="snip-progress">
                      <div className="snip-progress-bar">
                        <div 
                          className="snip-progress-fill"
                          style={{ width: `${getPlaybackProgress(snip) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="snip-actions">
                <Link 
                  to={`/snipdefine/${snip.trackId}`} 
                  state={snip.episodeData}
                  className="button snip-edit-button"
                >
                  Edit Snip
                </Link>
                <button 
                  className="button snip-delete-button"
                  onClick={() => deleteSnip(snip.storageKey)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnipList;
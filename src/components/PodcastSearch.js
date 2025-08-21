import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';
import Podcast from './Podcast';

const PodcastSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState('');
  const [resultCount, setResultCount] = useState('0');

  const basePodcastURL = "https://itunes.apple.com/search?media=podcast&entity=podcast&term=";

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    getPodcasts();
  };

  const getPodcasts = async () => {
    try {
      const URL = encodeURI(basePodcastURL + searchTerm);
      const response = await fetch(URL);
      const data = await response.json();
      
      console.log(data.results);
      setPodcasts(data.results);
      setResultCount(data.resultCount);
      setError('');
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      setError('Failed to fetch podcasts. Please try again.');
      setPodcasts([]);
      setResultCount('0');
    }
  };

  return (
    <div className="podcast-search-container">  
      <div className="app-header">
        <h1>SnipSnop</h1>
        <Link to="/snips" className="button fancy-button">
          My Snips
        </Link>
      </div>

      <div className="search-form-wrapper">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-group">        
            <label htmlFor="name">Podcast Search</label>
            <input 
              id="name" 
              type="text" 
              value={searchTerm} 
              onChange={handleChange}
              placeholder="Enter podcast name..."
              className="search-input"
            />
          </div>
          <button className="button search-button" type="submit">Search</button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        
        {resultCount > 0 && (
          <div className="results-summary">
            <span className="results-count">{resultCount}</span> podcast{resultCount !== '1' ? 's' : ''} found
          </div>
        )}
      </div>

      <div className="podcasts-grid">
        {podcasts.map((podcast) => (
          <Podcast
            collectionName={podcast.collectionName}
            artworkUrl={podcast.artworkUrl600}
            artistName={podcast.artistName}
            collectionId={podcast.collectionId}
            key={podcast.collectionId}
          />
        ))}
      </div>
    </div>
  );
};

export default PodcastSearch;

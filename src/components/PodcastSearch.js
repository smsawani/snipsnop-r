import { useState } from 'react';
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
    <div className="container">  
      <form onSubmit={handleSubmit}>
        <br/>
        <div>        
          <label htmlFor="name">podcast search</label>
          <input 
            id="name" 
            type="text" 
            value={searchTerm} 
            onChange={handleChange} 
          />
        </div>
        <button className="button" type="submit">Search</button>
      </form>
      <p>{error}</p>
      <p><b>{resultCount} results found</b></p>     

      <div>
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

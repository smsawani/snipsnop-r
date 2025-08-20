import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../style.css';
import Episode from './Episode';

const EpisodeSelect = () => {
  const { collectionId } = useParams();
  const location = useLocation();
  const [episodes, setEpisodes] = useState([]);
  
  const { artistName, collectionName } = location.state || {};

  const baseEpisodesURL = "https://itunes.apple.com/lookup?id=";
  const endingEpisodesURL = "&country=US&media=podcast&entity=podcastEpisode&limit=100";

  const getEpisodes = async () => {
    try {
      const URL = encodeURI(baseEpisodesURL + collectionId + endingEpisodesURL);
      const response = await fetch(URL);
      const data = await response.json();
      
      console.log(data.results);
      setEpisodes(data.results);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  useEffect(() => {
    if (collectionId) {
      getEpisodes();
    }
  }, [collectionId]);

  return (      
    <div className="container"> 
      <div className="row">
        <div className="col">  
          <h1>{collectionName}</h1>
          <h2>{artistName}</h2>
          <h2>{collectionId}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col"><hr/></div>
      </div>

      <div>
        {episodes.slice(1).map((episode) => (
          <Episode
            collectionName={episode.collectionName}
            artworkUrl={episode.artworkUrl160}
            description={episode.description}
            releaseDate={episode.releaseDate}
            trackId={episode.trackId}
            trackName={episode.trackName}
            episodeUrl={episode.episodeUrl}
            key={episode.trackId}
          />
        ))}
      </div>
    </div>
  );
};

export default EpisodeSelect;
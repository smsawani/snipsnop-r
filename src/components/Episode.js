import { Link } from 'react-router-dom';
import '../style.css';

const Episode = ({ 
  collectionName, 
  artworkUrl, 
  description, 
  releaseDate, 
  episodeUrl, 
  trackId, 
  trackName 
}) => {
  const episodeState = {
    collectionName,
    artworkUrl,
    description,
    releaseDate,
    episodeUrl,
    trackId,
    trackName
  };

  return (
    <div className="episode-container">  
      <div className="episode-content">
        <div className="episode-image-wrapper">
          <Link to={`/snipdefine/${trackId}`} state={episodeState}>
            <img className="episodeImage" src={artworkUrl} alt={trackName} />
          </Link>
        </div>
        <div className="episode-details">
          <Link to={`/snipdefine/${trackId}`} state={episodeState} className="episode-title-link">
            <h3 className="episode-title">{trackName}</h3>
          </Link>
          <p className="episode-date">{releaseDate}</p>
          <p className="episode-description">{description}</p>
        </div>
      </div>
      <hr className="episode-divider" />
    </div>
  );
};

export default Episode;
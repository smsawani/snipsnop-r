import { Link } from 'react-router-dom';
import '../style.css';

const Podcast = ({ collectionId, collectionName, artworkUrl, artistName }) => {
  const podcastState = {
    collectionId,
    collectionName,
    artworkUrl,
    artistName
  };

  return (
    <div className="podcast-card">  
      <Link to={`/episodes/${collectionId}`} state={podcastState} className="podcast-link">
        <div className="podcast-image-wrapper">
          <img className="podcastImage" src={artworkUrl} alt={collectionName} />
        </div>
        <div className="podcast-info">
          <h3 className="podcast-title">{collectionName}</h3>
          <p className="podcast-artist">{artistName}</p>
        </div>
      </Link>
    </div>
  );
};

export default Podcast;
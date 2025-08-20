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
    <div className="containerBlock">  
      <div className="row">
        <div className="col">
          <Link to={`/episodes/${collectionId}`} state={podcastState}>
            <img className="podcastImage" src={artworkUrl} alt={collectionName} />
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Link to={`/episodes/${collectionId}`} state={podcastState}>
            <h3>{collectionName}</h3>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h4>{artistName}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h4>{collectionId}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col"><hr/></div>
      </div> 
    </div>
  );
};

export default Podcast;
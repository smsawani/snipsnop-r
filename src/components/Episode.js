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
    <div className="container">  
      <div className="row" style={{ display: 'flex' }}>
        <div className="col">
          <Link to={`/snipdefine/${trackId}`} state={episodeState}>
            <img className="episodeImage" src={artworkUrl} alt={trackName} />
          </Link>
        </div>
        <div className="col">
          <div className="row">
            <div className="col">
              <Link to={`/snipdefine/${trackId}`} state={episodeState}>
                <h3>{trackName}</h3>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>{releaseDate}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>{trackId}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>{description}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col"><hr/></div>
      </div> 
    </div>
  );
};

export default Episode;
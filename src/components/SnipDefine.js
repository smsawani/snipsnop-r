import { useLocation } from 'react-router-dom';
import '../style.css';

const SnipDefine = () => {
  const location = useLocation();
  const episodeData = location.state || {};
  
  const {
    episodeUrl,
    trackId
  } = episodeData;

  console.log(JSON.stringify(episodeData));

  return (      
    <div className="container"> 
      <div className="row">
        <div className="col">                  
          PROPS:
          <pre>
            {JSON.stringify(episodeData, null, 3)}
          </pre>
          <br/>
          <hr/>
          {trackId}
          <br/>
          <hr/>
          {episodeUrl}
          <br/>
          <hr/>
        </div>
      </div>
    
      <div>
        <audio id="player" controls>
          <source id="player-source" src={episodeUrl} type="audio/mpeg"/>
          Your browser does not support the audio element.
        </audio>  
      </div> 
    </div>
  );
};

export default SnipDefine;
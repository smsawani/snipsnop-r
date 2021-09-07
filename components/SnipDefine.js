import React from 'react';
import '../style.css';
import Episode from './Episode';


/*
 collectionName: props.collectionName,
      artworkUrl: props.artworkUrl,
      description: props.description,
      releaseDate: props.releaseDate,
      episodeUrl: props.episodeUrl,
      trackId: props.trackId,
      trackName: props.trackName


*/

class SnipDefine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        artworkUrl: props.location.state.artworkUrl,
        description: props.location.state.description,
        releaseDate: props.location.state.releaseDate,
        episodeUrl: props.location.state.episodeUrl,
        trackId: props.location.state.trackId,
        trackName: props.location.state.trackName  
    };

    // iTunes API
    this.baseEpisodesURL = "https://itunes.apple.com/lookup?id=";
    this.endingEpisodesURL = "&country=US&media=podcast&entity=podcastEpisode&limit=100";

    console.log(JSON.stringify(this.state));
  }

  render() {
    return (      
      <div className="container"> 
        <div className="row">
            <div className="col">                  
                  PROPS:
                  <pre>
                  { JSON.stringify(this.props.location.state  , '\t', 3) }
                  </pre>
                  <br/>
                  STATE:
                  <pre>
                  { JSON.stringify(this.state  , '\t', 3) }
                  </pre>
                  <br/>
                  <hr/>
                  { this.state.trackId }
                  <br/>
                  <hr/>
                  { this.state.episodeUrl }
                  <br/>
                  <hr/>
            </div>
        </div>
      
        <div>
          <audio id="player" controls>
            <source id="player-source" src={this.state.episodeUrl} type="audio/mpeg"/>
            Your browser does not support the audio element.
          </audio>  
        </div> 


      </div>
    );
  }
}

export default SnipDefine;
import React from 'react';
import '../style.css';
import Episode from './Episode';

class EpisodeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        episodes: [],
        collectionId: props.match.params.collectionId,
        artistName: props.location.state.artistName,
        collectionName: props.location.state.collectionName,
        artworkUrl: props.location.state.artworkUrl
    };

    // iTunes API
    this.baseEpisodesURL = "https://itunes.apple.com/lookup?id=";
    this.endingEpisodesURL = "&country=US&media=podcast&entity=podcastEpisode&limit=100";

    console.log(JSON.stringify(this.state));
  }

  componentDidMount() {
    this.getEpisodes();
  }

  getEpisodes = () => {
    const headers = { 'Content-Type': 'application/json' };

    let URL = encodeURI(this.baseEpisodesURL + this.state.collectionId + this.endingEpisodesURL);

    fetch(URL)
      .then(response => {
          //console.log('1st then ');
          return response.json();
      })
      .then(myJson=> {
          //console.log('2nd then ');
          console.log(myJson.results);    // ### THIS IS THE ARRAY OF EPISODES ###
          this.setState({episodes: myJson.results, resultCount: myJson.resultCount})
      })
      .catch(error => {
          //console.log(error);
          if (error.response) {     
            console.log('response: ' + error.response.data);
            console.log('response: ' + error.response.status);
            console.log('response: ' + error.response.headers);
          } 
          else if (error.request) {
            console.log('request: ' + error.request);
          } 
          else {    
            console.log('other error: ', error.message);
          }
      });
  }


  render() {
    return (      
      <div className="container"> 
        <div className="row">
            <div className="col">  
              <h1>{this.state.collectionName }</h1>
              <h2>{this.state.artistName }</h2>
              <h2>{this.state.collectionId }</h2>
            </div>
        </div>
        <div className="row">
          <div className="col"><hr/></div>
        </div>

        <div>
          {this.state.episodes.slice(1).map((episode) => (
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
  }
}

export default EpisodeSelect;
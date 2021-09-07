import React from 'react';
import '../style.css';
import Podcast from './Podcast';

class PodcastSearch extends React.Component {

  // constructor
  constructor(props) {
    super(props);
    this.state = { 
      searchTerm: '',
      podcasts: [],
      error: '',
      resultCount: '0'
    };

    // event handler bindings 
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    // iTunes API
    this.basePodcastURL = "https://itunes.apple.com/search?media=podcast&entity=podcast&term=";
  }

  handleChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  // submit
  handleSubmit(event) {
    this.getPodcasts();
    event.preventDefault(); 
  }

  getPodcasts = () => {
    //console.log(this.basePodcastURL + this.state.searchTerm);
    const headers = { 'Content-Type': 'application/json' };

    let URL = encodeURI(this.basePodcastURL + this.state.searchTerm);

    fetch(URL)
      .then(response => {
          //console.log('1st then ');
          return response.json();
      })
      .then(myJson=> {
          //console.log('2nd then ');
          console.log(myJson.results);    // ### THIS IS THE ARRAY OF PODCASTS ###
          this.setState({podcasts: myJson.results, resultCount: myJson.resultCount})
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

  // render
  render() {
    return (
      <div className="container">  
        <form onSubmit={this.handleSubmit}>
            <br/>
            <div>        
              <label htmlFor="name">podcast search</label>
              <input id="name" type="text" value={this.state.searchTerm} onChange={this.handleChange} ></input>
            </div>
            <button className="button" type="submit">Search</button>
        </form>
        <p>{this.state.error}</p>
        <p><b>{this.state.resultCount} results found</b></p>     

        <div>
          {this.state.podcasts.map((podcast) => (
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
  }
}

export default PodcastSearch;

import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import '../style.css';

class Episode extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = { 
      collectionName: props.collectionName,
      artworkUrl: props.artworkUrl,
      description: props.description,
      releaseDate: props.releaseDate,
      episodeUrl: props.episodeUrl,
      trackId: props.trackId,
      trackName: props.trackName
    };
  }

  // render
  render() {
    return (
        <div className="container">  
          <div className="row" style={{ display: 'flex' }}>
            <div className="col">
              <Link to={{ pathname:`/snipdefine/` + this.state.trackId, 
                          state: {...this.state}  }}>
                <img className="episodeImage" src={this.state.artworkUrl}/>
              </Link>
            </div>
            <div className="col">
              <div className="row">
                <div className="col">
                  <Link to={{ pathname:`/snipdefine/` + this.state.collectionId, 
                              state: {...this.state}  }}>
                    <h3>{this.state.trackName}</h3>
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h4>{this.state.releaseDate}</h4>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h4>{this.state.trackId}</h4>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h4>{this.state.description}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col"><hr/></div>
          </div> 
        </div>
    );
  }
}

export default Episode;
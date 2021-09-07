import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import '../style.css';

class Podcast extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = { 
      collectionId: props.collectionId,
      collectionName: props.collectionName,
      artworkUrl: props.artworkUrl,
      artistName: props.artistName
    };
  }

  // render
  render() {
    return (
        <div className="containerBlock">  
          <div className="row">
            <div className="col">
              <Link to={{ pathname:`/episodes/` + this.state.collectionId, 
                          state: {...this.state}  }}>
                <img className="podcastImage" src={this.state.artworkUrl}/>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to={{ pathname:`/episodes/` + this.state.collectionId, 
                          state: {...this.state}  }}>
                <h3>{this.state.collectionName}</h3>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>{this.state.artistName}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>{this.state.collectionId}</h4>
            </div>
          </div>
          <div className="row">
            <div className="col"><hr/></div>
          </div> 
        </div>
    );
  }
}

export default Podcast;
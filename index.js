import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import PodcastSearch from './components/PodcastSearch';
import EpisodeSelect from './components/EpisodeSelect';
import SnipDefine from './components/SnipDefine';
import './style.css';



class SnipSnop extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'React'
    };
  }

  render() {
    return (
      <Router>
        <Switch>
            <Route exact path="/" component={PodcastSearch} />  
            <Route path="/episodes/:collectionId" 
              render={(props) => <EpisodeSelect {...props} />} />
            <Route path="/snipdefine/:collectionId" 
              render={(props) => <SnipDefine {...props} />} />
        </Switch>
      </Router>
    );
  }
}


render(<SnipSnop />, document.getElementById('root'));

import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import PodcastSearch from './components/PodcastSearch';
import EpisodeSelect from './components/EpisodeSelect';
import SnipDefine from './components/SnipDefine';
import SnipList from './components/SnipList';
import './style.css';

const SnipSnop = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PodcastSearch />} />
        <Route path="/episodes/:collectionId" element={<EpisodeSelect />} />
        <Route path="/snipdefine/:trackId" element={<SnipDefine />} />
        <Route path="/snips" element={<SnipList />} />
      </Routes>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<SnipSnop />);

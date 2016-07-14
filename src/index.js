import React from 'react';
import ReactDOM from 'react-dom';
import {
  Router,
  Route,
  IndexRoute,
  browserHistory
} from 'react-router';
import LoginActions from './actions/LoginActions';
import App from './App';
import HomePage from './pages/HomePage';
import ImprintPage from './pages/ImprintPage';
import MelodyStatistics from './pages/MelodyStatistics';
import MetadataStatistics from './pages/MetadataStatistics';
import SimilarityStatistics from './pages/SimilarityStatistics';
import SongsheetList from './pages/SongsheetList';
import SongsheetView from './pages/SongsheetView';
import SearchIndex from './pages/SearchIndex';
import ResultList from './pages/ResultList';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import UploadPage from './pages/UploadPage';
import UploadProgressPage from './pages/UploadProgressPage';


var router = (
  <Router history={browserHistory}>
    <Route name="home" path="/" component={App}>
      <IndexRoute component={HomePage} />

      <Route name="melodyStats" path="/statistics/melody" component={MelodyStatistics} />
      <Route name="metadataStats" path="/statistics/metadata" component={MetadataStatistics} />
      <Route name="similarityStats" path="/statistics/similarity" component={SimilarityStatistics} />

      <Route name="songsheets" path="/songsheets" component={SongsheetList} />
      <Route name="songsheet" path="/songsheets/:signature" component={SongsheetView} />

      <Route name="search" path="/search" component={SearchIndex} />
      <Route name="search-results" path="/search/result" component={ResultList} />

      <Route name="login" path="/login" component={LoginPage} />
      <Route name="logout" path="/logout" component={LogoutPage} />

      <Route name="upload" path="/upload" component={UploadPage} onEnter={UploadPage.willTransitionTo} />
      <Route name="upload-progress" path="/upload/progress" component={UploadProgressPage} onEnter={UploadProgressPage.willTransitionTo} />

      <Route name="imprint" path="/imprint" component={ImprintPage} />
    </Route>
  </Router>
);

let jwt = localStorage.getItem('jwt');
if (jwt) {
  LoginActions.loginUser(jwt);
}

ReactDOM.render(router, document.getElementById('root'));

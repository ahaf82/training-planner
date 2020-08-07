import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import MemberPage from './components/pages/MemberPage';
import Groups from './components/pages/Groups';
import Sessions from './components/pages/Sessions';
// import PrivacyPolicy from './components/auth/PrivacyPolicy';
import About from './components/pages/About';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import OldSessions from './components/trainingSessions/OldSessions';
import Alerts from './components/layout/Alerts';
import TrainingGroupListModal from './components/member/TrainingGroupListModal';
import ClearModalMember from './components/member/ClearModalMember';
import ClearModalGroup from './components/trainingGroups/ClearModalGroup';
import ClearModalSession from './components/trainingSessions/ClearModalSession';

import PrivatRoute from './components/routing/PrivateRoute';

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';

import TrainingGroupState from './context/trainingGroup/TrainingGroupState';
import TrainingSessionState from './context/trainingSession/TrainingSessionState';
import MemberState from './context/member/MemberState';
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import setAuthToken from './utils/setAuthToken';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    // Initializes Materialize JS
    M.AutoInit();
  });

  return (
    <AuthState>
      <TrainingGroupState>
        <TrainingSessionState>
        <MemberState>
          <AlertState>
            <Router>
                <Fragment >
                  <Navbar />
                  <div className="container top">
                    <Alerts />
                    <Switch>
                      < PrivatRoute exact path="/" component={Home} />
                      < Route exact path="/about" component={About} />
                      {/* < Route exact path="/policy" component={PrivacyPolicy} /> */}
                      < PrivatRoute exact path="/sessions" component={Sessions} />
                      < PrivatRoute exact path="/memberPage" component={MemberPage} />
                      < PrivatRoute exact path="/groups" component={Groups} />
                      < PrivatRoute exact path="/oldSess" component={OldSessions} />
                      < Route exact path="/register" component={Register} />
                      < Route exact path="/login" component={Login} />
                    </Switch>
                  </div>
                  <TrainingGroupListModal />
                  <ClearModalMember />
                  <ClearModalGroup />
                  <ClearModalSession />
                </Fragment>
              </Router>
          </AlertState>
        </MemberState>
        </TrainingSessionState>
      </TrainingGroupState>
    </AuthState> 
  );
}

export default App;

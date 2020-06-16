import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alerts from './components/layout/Alerts';
import PrivatRoute from './components/routing/PrivateRoute';

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
  return (
    <AuthState>
      <TrainingGroupState>
        <TrainingSessionState>
        <MemberState>
          <AlertState>
            <Router>
                <Fragment >
                  <Navbar />
                  <div className="container">
                    <Alerts />
                    <Switch>
                      < PrivatRoute exact path="/" component={Home} />
                      < Route exact path="/about" component={About} />
                      < Route exact path="/register" component={Register} />
                      < Route exact path="/login" component={Login} />
                    </Switch>
                  </div>
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

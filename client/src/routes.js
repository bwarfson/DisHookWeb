import React from 'react';
import { Route, Router } from 'react-router-dom';
import Home from './components/home';
import Auth from './auth';
import Callback from './components/callback';
import history from './history';
import queryString from 'query-string';

const auth = new Auth();

const handleAuthentication = (props) => {
    let params = queryString.parse(props.location.search);
    //console.log(params);
    if (params.code) {
        //console.log(params.code);
        auth.handleAuthentication(params.code);
    }
  }

const Routes = () => (
    <Router history={history} component={Home}>
      <div>
        <Route exact path="/" render={(props) => <Home auth={auth} {...props} />} />
        <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />
        }}/>
      </div>
    </Router>
  );
  
  export default Routes;
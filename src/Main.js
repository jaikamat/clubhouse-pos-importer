import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import AuthCallback from './AuthCallback';

function Main() {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/authcallback" component={AuthCallback} />
            </Switch>
        </div>
    );
}

export default Main;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sale from './Sale';
import BrowseSales from './BrowseSales';
import Login from './Login';
import Logout from './Logout';
import { Container } from 'semantic-ui-react';

function Main({ handleLogin, loggedIn }) {
    // Use the render syntax in the Login component to bind passed props
    return (
        <div style={{ marginTop: '40px', marginLeft: '20px', marginRight: '20px' }}>
            <br />
            <Switch>
                <Route exact path="/manage-inventory" component={Home} />
                <Route exact path="/new-sale" component={Sale} />
                <Route exact path="/browse-sales" component={BrowseSales} />
                <Route
                    exact
                    path="/login"
                    render={() => (
                        <Login handleLogin={handleLogin} loggedIn={loggedIn} />
                    )}
                />
                <Route
                    exact
                    path="/logout"
                    render={() => (
                        <Logout handleLogin={handleLogin} loggedIn={loggedIn} />
                    )}
                />
            </Switch>
        </div>
    );
}

export default Main;

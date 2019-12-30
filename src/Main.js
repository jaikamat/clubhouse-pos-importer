import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sale from './Sale';
import BrowseSales from './BrowseSales';
import Login from './Login';
import { Container } from 'semantic-ui-react';

function Main() {
    return (
        <Container style={{ marginTop: '40px' }}>
            <br />
            <Switch>
                <Route exact path="/manage-inventory" component={Home} />
                <Route exact path="/new-sale" component={Sale} />
                <Route exact path="/browse-sales" component={BrowseSales} />
                <Route exact path="/login" component={Login} />
            </Switch>
        </Container>
    );
}

export default Main;

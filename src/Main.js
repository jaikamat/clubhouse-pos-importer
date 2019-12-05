import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sale from './Sale';
import BrowseInventory from './BrowseInventory';

function Main() {
    return (
        <div style={{ marginTop: '40px' }}>
            <Switch>
                <Route exact path="/manage-inventory" component={Home} />
                <Route exact path="/new-sale" component={Sale} />
                <Route
                    exact
                    path="/browse-inventory"
                    component={BrowseInventory}
                />
            </Switch>
        </div>
    );
}

export default Main;

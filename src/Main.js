import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sale from './Sale';
import BrowseSales from './BrowseSales';
import PublicInventory from './PublicInventory';
import DeckboxClone from './DeckboxClone';
import Login from './Login';
import Logout from './Logout';
import Receiving from './Receiving/Receiving'

export default function Main() {
    return (
        <div style={{ paddingTop: '52.63px', marginLeft: '20px', marginRight: '20px' }}>
            <br />

            <Switch>
                <Route exact path="/manage-inventory" component={Home} />
                <Route exact path="/new-sale" component={Sale} />
                <Route exact path="/browse-sales" component={BrowseSales} />
                <Route exact path="/browse-inventory" component={DeckboxClone} />
                <Route exact path="/public-inventory" component={PublicInventory} />
                <Route exact path="/receiving" component={Receiving} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
            </Switch>
        </div>
    )
}
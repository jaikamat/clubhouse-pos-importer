import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './ManageInventory/Home';
import Sale from './NewSale/Sale';
import BrowseSales from './BrowseSales/BrowseSales';
import PublicInventory from './PublicInventory/PublicInventory';
import DeckboxClone from './DeckboxClone/DeckboxClone';
import Login from './Login';
import Logout from './Logout';
import Receiving from './Receiving/Receiving';
import Reports from './Reports/Reports'
import styled from 'styled-components';
import { Segment, Icon, Header } from 'semantic-ui-react';

const ContentContainer = styled.div`
    padding-top: 52.63px;
    margin-left: 20px;
    margin-right: 20px;
`;

const CovidAlert = () => {
    return <Segment placeholder>
        <Header icon>
            <Icon name="exclamation circle" color="blue" />
            A notice to our customers regarding COVID19
        </Header>
        <span>
            The Clubhouse is open for curbside service every Wednesday and Sunday, from 12pm to 5pm. Simply reach us on <a href="https://discord.gg/2tMxhgw

" target="_blank">Discord</a>, <a href="https://www.facebook.com/RGTClubhouse" target="_blank">Facebook</a>, or call us at (503) 268-1449 to set up an order. We look forward to serving you soon!</span>
    </Segment>
}

export default function Main() {
    return (
        <ContentContainer>
            <br />

            <Switch>
                <Route exact path="/" component={CovidAlert} />
                <Route exact path="/manage-inventory" component={Home} />
                <Route exact path="/new-sale" component={Sale} />
                <Route exact path="/browse-sales" component={BrowseSales} />
                <Route exact path="/browse-inventory" component={DeckboxClone} />
                <Route exact path="/public-inventory" component={PublicInventory} />
                <Route exact path="/receiving" component={Receiving} />
                <Route exact path="/reports" component={Reports} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
            </Switch>
        </ContentContainer>
    )
}
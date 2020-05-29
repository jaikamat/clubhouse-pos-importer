import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './ManageInventory/Home';
import Sale from './NewSale/Sale';
import BrowseSales from './BrowseSales/BrowseSales';
import PublicInventory from './PublicInventory/PublicInventory';
import DeckboxClone from './DeckboxClone/DeckboxClone';
import Login from './Login/Login';
import Logout from './Logout/Logout';
import Receiving from './Receiving/Receiving';
import Reports from './Reports/Reports'
import styled from 'styled-components';
import { Segment, Icon, Header } from 'semantic-ui-react';

const ContentContainer = styled.div`
    padding-top: 52.63px;
    margin-left: 20px;
    margin-right: 20px;
`;

const CenterSpan = styled.span`
    text-align: center;
`;

const Alert = () => {
    return <Segment placeholder>
        <Header icon>
            <Icon name="exclamation circle" color="blue" />
            The Clubhouse is open 🎉
        </Header>
        <CenterSpan>It's official! We are now open 7 days a week. Until further notice, our hours are 12 pm to 6 pm - the play space is still closed however. We look forward to seeing you soon!</CenterSpan>
    </Segment>
}

export default function Main() {
    return (
        <ContentContainer>
            <br />

            <Switch>
                <Route exact path="/" component={Alert} />
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
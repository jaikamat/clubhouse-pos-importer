import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Sale from './Sale';
import BrowseSales from './BrowseSales';
import PublicInventory from './PublicInventory';
import DeckboxClone from './DeckboxClone';
import Login from './Login';
import Logout from './Logout';
import Receiving from './Receiving/Receiving';
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
            Effective immediately, we will be shutting down the entirety of our play space besides 24 seats at the 3 front tables of the store. This will be our maximum player capacity for the foreseeable future.
            </span>
        <br />
        <span>
            In addition to our play space restriction, we will also be implementing a policy in which our tables will be available for free play during business hours, excluding those taken by our scheduled events throughout the week. If we have players here for any scheduled event (Wednesday Legacy, FNM, etc.) and you are not here to play in the event, please expect us to ask you to give up your seat for players interested in participating. Your cooperation will be greatly appreciated by fellow players and by our staff.
            </span>
        <br />
        <span>
            Please don't hesitate to contact us with questions or concerns. We thank you all for your understanding.
            </span>
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
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
            </Switch>
        </ContentContainer>
    )
}
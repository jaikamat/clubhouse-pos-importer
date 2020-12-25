import React from 'react';
import Header from './Header/Header';
import AuthProvider from './context/AuthProvider';
import { Switch, Route } from 'react-router-dom';
import Home from './ManageInventory/Home';
import Sale from './NewSale/Sale';
import BrowseSales from './BrowseSales/BrowseSales';
import PublicInventory from './PublicInventory/PublicInventory';
import DeckboxClone from './DeckboxClone/DeckboxClone';
import Login from './Login/Login';
import Logout from './Logout/Logout';
import Receiving from './Receiving/Receiving';
import Reports from './Reports/Reports';
import LandingPage from './LandingPage/LandingPage';
import styled from 'styled-components';
import { SaleProvider } from './context/SaleContext';
import { ReceivingProvider } from './context/ReceivingContext';

const ContentContainer = styled.div`
    padding-top: 75px;
    margin-left: 20px;
    margin-right: 20px;
`;

const BackgroundColor = styled.div`
    background-color: #f9fafb;
    min-height: 100vh;
`;

class App extends React.Component {
    render() {
        return (
            <AuthProvider>
                <Header />
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <BackgroundColor>
                        <ContentContainer id="content-container">
                            <Route
                                exact
                                path="/manage-inventory"
                                component={Home}
                            />
                            <SaleProvider>
                                <Route
                                    exact
                                    path="/new-sale"
                                    component={Sale}
                                />
                            </SaleProvider>
                            <Route
                                exact
                                path="/browse-sales"
                                component={BrowseSales}
                            />
                            <Route
                                exact
                                path="/browse-inventory"
                                component={DeckboxClone}
                            />
                            <Route
                                exact
                                path="/public-inventory"
                                component={PublicInventory}
                            />
                            <ReceivingProvider>
                                <Route
                                    exact
                                    path="/receiving"
                                    component={Receiving}
                                />
                            </ReceivingProvider>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/logout" component={Logout} />
                        </ContentContainer>
                    </BackgroundColor>
                </Switch>
            </AuthProvider>
        );
    }
}

export default App;

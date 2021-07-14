import React, { FC, useState } from 'react';
import Header from './Header/Header';
import AuthProvider from './context/AuthProvider';
import { Switch, Route } from 'react-router-dom';
import ManageInventory from './ManageInventory/ManageInventory';
import Sale from './NewSale/Sale';
import BrowseSales from './BrowseSales/BrowseSales';
import PublicInventory from './PublicInventory/PublicInventory';
import DeckboxClone from './DeckboxClone/DeckboxClone';
import Login from './Login/Login';
import Logout from './Logout/Logout';
import Receiving from './Receiving/Receiving';
import styled from 'styled-components';
import { SaleProvider } from './context/SaleContext';
import ReceivingProvider from './context/ReceivingContext';
import InventoryProvider from './context/InventoryContext';
import AdminRoute from './AuthenticatedRoute';
import Home from './LandingPage/Home';
import BrowseReceiving from './BrowseReceiving/BrowseReceiving';
import { Box, createMuiTheme, ThemeProvider } from '@material-ui/core';
import NavBar from './Header/NavBar';

const ContentContainer = styled.div`
    padding-top: 75px;
    margin-left: 20px;
    margin-right: 20px;
`;

const BackgroundColor = styled.div`
    background-color: #f9fafb;
    min-height: 100vh;
`;

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2185d0',
        },
    },
});

const App: FC = () => {
    const [showBar, setShowBar] = useState<boolean>(false);

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Header />
                {showBar && <NavBar />}
                <Box pt={10}>
                    <button onClick={() => setShowBar(!showBar)}>Switch</button>
                </Box>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <BackgroundColor>
                        <ContentContainer id="content-container">
                            <AdminRoute exact path="/manage-inventory">
                                <InventoryProvider>
                                    <ManageInventory />
                                </InventoryProvider>
                            </AdminRoute>
                            <AdminRoute exact path="/new-sale">
                                <SaleProvider>
                                    <Sale />
                                </SaleProvider>
                            </AdminRoute>
                            <AdminRoute exact path="/receiving">
                                <ReceivingProvider>
                                    <Receiving />
                                </ReceivingProvider>
                            </AdminRoute>
                            <AdminRoute exact path="/browse-sales">
                                <BrowseSales />
                            </AdminRoute>
                            <AdminRoute exact path="/browse-inventory">
                                <DeckboxClone />
                            </AdminRoute>
                            <AdminRoute exact path="/browse-receiving">
                                <BrowseReceiving />
                            </AdminRoute>
                            <Route
                                exact
                                path="/public-inventory"
                                component={PublicInventory}
                            />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/logout" component={Logout} />
                        </ContentContainer>
                    </BackgroundColor>
                </Switch>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;

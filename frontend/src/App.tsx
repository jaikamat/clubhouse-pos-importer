import React, { FC } from 'react';
import AuthProvider from './context/AuthProvider';
import { Switch, Route } from 'react-router-dom';
import ManageInventory from './ManageInventory/ManageInventory';
import Sale from './Sale/Sale';
import BrowseSales from './BrowseSales/BrowseSales';
import PublicInventory from './PublicInventory/PublicInventory';
import BrowseInventory from './BrowseInventory/BrowseInventory';
import Login from './Login/Login';
import Receiving from './Receiving/Receiving';
import { SaleProvider } from './context/SaleContext';
import ReceivingProvider from './context/ReceivingContext';
import InventoryProvider from './context/InventoryContext';
import AdminRoute from './AuthenticatedRoute';
import Home from './LandingPage/Home';
import BrowseReceiving from './BrowseReceiving/BrowseReceiving';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import NavBar from './NavBar/NavBar';
import Reporting from './Reporting/Reporting';
import BulkInventory from './BulkInventory/BulkInventory';
import ToastProvider from './ui/ToastContext';

const useStyles = makeStyles(({ spacing }) => ({
    contentContainer: {
        paddingTop: spacing(10),
        marginLeft: spacing(3),
        marginRight: spacing(3),
    },
    backgroundColor: {
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
    },
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2185d0',
        },
    },
});

const App: FC = () => {
    const { backgroundColor, contentContainer } = useStyles();

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <ToastProvider>
                    <NavBar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <div className={backgroundColor}>
                            <div className={contentContainer}>
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
                                    <BrowseInventory />
                                </AdminRoute>
                                <AdminRoute exact path="/browse-receiving">
                                    <BrowseReceiving />
                                </AdminRoute>
                                <AdminRoute exact path="/bulk-add">
                                    <BulkInventory />
                                </AdminRoute>
                                <Route
                                    exact
                                    path="/public-inventory"
                                    component={PublicInventory}
                                />
                                <Route
                                    exact
                                    path="/reporting"
                                    component={Reporting}
                                />
                                <Route exact path="/login" component={Login} />
                            </div>
                        </div>
                    </Switch>
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;

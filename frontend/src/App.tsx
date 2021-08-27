import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminRoute from './AuthenticatedRoute';
import BrowseInventory from './BrowseInventory/BrowseInventory';
import BrowseReceiving from './BrowseReceiving/BrowseReceiving';
import BrowseSales from './BrowseSales/BrowseSales';
import BulkInventory from './BulkInventory/BulkInventory';
import AuthProvider from './context/AuthProvider';
import InventoryProvider from './context/InventoryContext';
import ReceivingProvider from './context/ReceivingContext';
import { SaleProvider } from './context/SaleContext';
import Home from './LandingPage/Home';
import Login from './Login/Login';
import ManageInventory from './ManageInventory/ManageInventory';
import NavBar from './NavBar/NavBar';
import PublicInventory from './PublicInventory/PublicInventory';
import Receiving from './Receiving/Receiving';
import Reporting from './Reporting/Reporting';
import Sale from './Sale/Sale';
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

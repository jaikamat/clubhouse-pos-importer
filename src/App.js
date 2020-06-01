import React from 'react';
import Main from './Main';
import Header from './Header/Header';
import AuthProvider from './context/AuthProvider';
import { SaleProvider } from './context/SaleContext';

class App extends React.Component {
    render() {
        return (
            <AuthProvider>
                <Header />
                <SaleProvider>
                    <Main />
                </SaleProvider>
            </AuthProvider>
        );
    }
}

export default App;

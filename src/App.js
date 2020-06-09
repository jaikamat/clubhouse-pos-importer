import React from 'react';
import Main from './Main';
import Header from './Header/Header';
import AuthProvider from './context/AuthProvider';
import { SaleProvider } from './context/SaleContext';
import { ReceivingProvider } from './context/ReceivingContext';

class App extends React.Component {
    render() {
        return (
            <AuthProvider>
                <Header />
                <SaleProvider>
                    <ReceivingProvider>
                        <Main />
                    </ReceivingProvider>
                </SaleProvider>
            </AuthProvider>
        );
    }
}

export default App;

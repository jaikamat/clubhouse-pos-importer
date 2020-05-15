import React from 'react';
import Main from './Main';
import Header from './Header/Header';
import AuthProvider from './context/AuthProvider';

class App extends React.Component {
    render() {
        return (
            <AuthProvider>
                <Header />
                <Main />
            </AuthProvider>
        );
    }
}

export default App;

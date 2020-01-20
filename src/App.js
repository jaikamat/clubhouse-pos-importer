import React from 'react';
import Main from './Main';
import Header from './Header';
import AuthProvider from './AuthProvider';

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

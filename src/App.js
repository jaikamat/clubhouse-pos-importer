import React from 'react';
import Main from './Main';
import Header from './Header';
import makeAuthHeader from './makeAuthHeader';
import { LOGIN } from './api_resources';
import axios from 'axios';

class App extends React.Component {
    state = { loggedIn: !!localStorage.getItem('clubhouse_JWT') };

    // This is passed to the Login component as props to trigger a re-render of the root navbar
    handleLogin = async (username, password) => {
        try {
            const { data } = await axios.post(LOGIN, {
                username: username.toLowerCase(),
                password: password
            }, { headers: makeAuthHeader() });

            if (data.token) {
                localStorage.setItem('clubhouse_JWT', data.token);

                this.setState({
                    loggedIn: !!localStorage.getItem('clubhouse_JWT')
                });

                return { authed: true };
            } else {
                localStorage.clear();

                this.setState({
                    loggedIn: !!localStorage.getItem('clubhouse_JWT')
                });

                return { authed: false };
            }
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        return (
            <div>
                <Header loggedIn={this.state.loggedIn} />
                <Main
                    handleLogin={this.handleLogin}
                    loggedIn={this.state.loggedIn}
                />
            </div>
        );
    }
}

export default App;

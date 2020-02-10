import React from 'react';
import makeAuthHeader from './makeAuthHeader';
import { LOGIN } from './api_resources';
import axios from 'axios';

export const AuthContext = React.createContext();

class AuthProvider extends React.Component {
    state = {
        loggedIn: !!localStorage.getItem('clubhouse_JWT'),
        handleLogin: async (username, password) => {
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
                    return { authed: false };
                }
            } catch (err) {
                console.log(err);
            }
        },
        handleLogout: async () => {
            try {
                localStorage.removeItem('clubhouse_JWT');

                this.setState({
                    loggedIn: !!localStorage.getItem('clubhouse_JWT')
                });

                return { authed: false };
            } catch (err) {
                console.log(err);
            }
        }
    }

    render() {
        return <AuthContext.Provider value={this.state}>
            {this.props.children}
        </AuthContext.Provider>
    }
}

export default AuthProvider
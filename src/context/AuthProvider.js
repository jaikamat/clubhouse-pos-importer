import React, { useState } from 'react';
import makeAuthHeader from '../utils/makeAuthHeader';
import { LOGIN } from '../utils/api_resources';
import axios from 'axios';

export const AuthContext = React.createContext();

export default function AuthProvider(props) {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('clubhouse_JWT'));

    const handleLogin = async (username, password) => {
        try {
            const { data } = await axios.post(LOGIN, {
                username: username.toLowerCase(),
                password: password
            }, { headers: makeAuthHeader() });

            if (data.token) {
                localStorage.setItem('clubhouse_JWT', data.token);
                setLoggedIn(!!localStorage.getItem('clubhouse_JWT'))

                return { authed: true };
            } else {
                return { authed: false };
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = async () => {
        try {
            localStorage.removeItem('clubhouse_JWT');
            setLoggedIn(!!localStorage.getItem('clubhouse_JWT'));

            return { authed: false };
        } catch (err) {
            console.log(err);
        }
    }

    return <AuthContext.Provider value={{ loggedIn, handleLogin, handleLogout }}>
        {props.children}
    </AuthContext.Provider>
}

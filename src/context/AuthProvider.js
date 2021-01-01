import React, { useState } from 'react';
import makeAuthHeader from '../utils/makeAuthHeader';
import { LOGIN } from '../utils/api_resources';
import axios from 'axios';

export const AuthContext = React.createContext();

export default function AuthProvider(props) {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem('clubhouse_JWT')
    );

    const [currentLocation, setCurrentLocation] = useState(
        localStorage.getItem('currentLocation')
    );

    const handleLogin = async (username, password, currentLocation) => {
        try {
            const { data } = await axios.post(
                LOGIN,
                {
                    username: username.toLowerCase(),
                    password,
                    currentLocation,
                },
                { headers: makeAuthHeader() }
            );

            if (data.token) {
                localStorage.setItem('clubhouse_JWT', data.token);
                setLoggedIn(!!localStorage.getItem('clubhouse_JWT'));

                localStorage.setItem('currentLocation', currentLocation);
                setCurrentLocation(currentLocation);
            }

            return data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('clubhouse_JWT');
            setLoggedIn(!!localStorage.getItem('clubhouse_JWT'));

            localStorage.removeItem('currentLocation', currentLocation);
            setCurrentLocation(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ loggedIn, handleLogin, handleLogout, currentLocation }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

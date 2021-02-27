import React, { FC, useState } from 'react';
import makeAuthHeader from '../utils/makeAuthHeader';
import { LOGIN } from '../utils/api_resources';
import axios from 'axios';

interface Props {}

type ClubhouseLocation = 'ch1' | 'ch2';

interface Context {
    loggedIn: boolean;
    handleLogin?: (
        username: string,
        password: string,
        currentLocation: ClubhouseLocation
    ) => Promise<any>;
    handleLogout?: () => void;
    currentLocation: ClubhouseLocation | null;
}

export const AuthContext = React.createContext<Context>({
    loggedIn: false,
    currentLocation: null,
});

const AuthProvider: FC<Props> = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem('clubhouse_JWT')
    );

    const [
        currentLocation,
        setCurrentLocation,
    ] = useState<ClubhouseLocation | null>(
        localStorage.getItem('currentLocation') as ClubhouseLocation
    );

    const handleLogin = async (
        username: string,
        password: string,
        currentLocation: ClubhouseLocation
    ) => {
        try {
            const { data }: { data: { token: string } } = await axios.post(
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

            localStorage.removeItem('currentLocation');
            setCurrentLocation(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{ loggedIn, handleLogin, handleLogout, currentLocation }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

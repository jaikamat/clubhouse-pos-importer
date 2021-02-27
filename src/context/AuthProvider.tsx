import React, { FC, useState } from 'react';
import loginQuery from './loginQuery';

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
    sessionUser: string | null;
}

export const AuthContext = React.createContext<Context>({
    loggedIn: false,
    currentLocation: null,
    sessionUser: null,
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

    const [sessionUser, setSessionUser] = useState<string | null>(
        localStorage.getItem('username')
    );

    const handleLogin = async (
        username: string,
        password: string,
        currentLocation: ClubhouseLocation
    ) => {
        try {
            const data = await loginQuery(username, password, currentLocation);

            if (data.token) {
                localStorage.setItem('clubhouse_JWT', data.token);
                setLoggedIn(!!localStorage.getItem('clubhouse_JWT'));

                localStorage.setItem('currentLocation', currentLocation);
                setCurrentLocation(currentLocation);

                localStorage.setItem('username', username);
                setSessionUser(username);
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

            localStorage.removeItem('username');
            setSessionUser(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                currentLocation,
                sessionUser,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

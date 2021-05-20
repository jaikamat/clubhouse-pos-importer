import React, { FC, useContext, useState } from 'react';
import loginQuery from './loginQuery';

interface Props {}

export type ClubhouseLocation = 'ch1' | 'ch2';

interface Context {
    loggedIn: boolean;
    handleLogin: (
        username: string,
        password: string,
        currentLocation: ClubhouseLocation
    ) => Promise<any>;
    handleLogout: () => void;
    currentLocation: ClubhouseLocation | null;
    currentUser: string | null;
}

export const AuthContext = React.createContext<Context>({
    loggedIn: false,
    currentLocation: null,
    currentUser: null,
    handleLogout: () => null,
    handleLogin: () => new Promise(() => null),
});

export const useAuthContext = () => useContext(AuthContext);

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

    const [currentUser, setCurrentUser] = useState<string | null>(
        localStorage.getItem('currentUser')
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

                localStorage.setItem('currentUser', username);
                setCurrentUser(username);
            }

            return data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('clubhouse_JWT');
        setLoggedIn(!!localStorage.getItem('clubhouse_JWT'));

        localStorage.removeItem('currentLocation');
        setCurrentLocation(null);

        localStorage.removeItem('currentUser');
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                currentLocation,
                currentUser,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

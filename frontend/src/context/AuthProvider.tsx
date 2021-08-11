import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import loginQuery from './loginQuery';

interface Props {}

export type ClubhouseLocation = 'ch1' | 'ch2';

const tokenKey = 'clubhouse_JWT';
const locationKey = 'currentLocation';
const userKey = 'currentUser';

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
    const history = useHistory();
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem(tokenKey));

    const [
        currentLocation,
        setCurrentLocation,
    ] = useState<ClubhouseLocation | null>(
        localStorage.getItem(locationKey) as ClubhouseLocation
    );

    const [currentUser, setCurrentUser] = useState<string | null>(
        localStorage.getItem(userKey)
    );

    /**
     * Handles multi-tab logouts.
     *
     * If the token is cleared and the new value is `null`,
     * we issue a logout to all other tabs
     */
    useEffect(() => {
        const storageListener = (e: StorageEvent) => {
            if (e.key === tokenKey && e.newValue === null) {
                handleLogout();
            }
        };

        window.addEventListener('storage', storageListener);

        return () => window.removeEventListener('storage', storageListener);
    }, []);

    const handleLogin = async (
        username: string,
        password: string,
        currentLocation: ClubhouseLocation
    ) => {
        try {
            const data = await loginQuery(username, password, currentLocation);

            if (data.token) {
                localStorage.setItem(tokenKey, data.token);
                setLoggedIn(!!localStorage.getItem(tokenKey));

                localStorage.setItem(locationKey, currentLocation);
                setCurrentLocation(currentLocation);

                localStorage.setItem(userKey, username);
                setCurrentUser(username);
            }

            return data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(tokenKey);
        setLoggedIn(!!localStorage.getItem(tokenKey));

        localStorage.removeItem(locationKey);
        setCurrentLocation(null);

        localStorage.removeItem(userKey);
        setCurrentUser(null);

        history.push('/login');
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

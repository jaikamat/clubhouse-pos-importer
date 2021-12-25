import React, { FC, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useLocalStorage from '../common/useLocalStorage';
import loginQuery from './loginQuery';

interface Props {}

export type ClubhouseLocation = 'ch1' | 'ch2';

const tokenKey = 'clubhouse_JWT';
const locationKey = 'currentLocation';
const userKey = 'currentUser';
const adminKey = 'admin';

interface Context {
    handleLogin: (
        username: string,
        password: string,
        currentLocation: ClubhouseLocation
    ) => Promise<any>;
    handleLogout: () => void;
    isLoggedIn: () => boolean;
    authToken: string | null;
    currentLocation: ClubhouseLocation | null;
    currentUser: string | null;
    admin: boolean | null;
}

export const AuthContext = React.createContext<Context>({
    authToken: null,
    currentLocation: null,
    currentUser: null,
    admin: null,
    isLoggedIn: () => false,
    handleLogout: () => null,
    handleLogin: () => new Promise(() => null),
});

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: FC<Props> = ({ children }) => {
    const history = useHistory();
    const [authToken, setAuthToken] = useLocalStorage(
        tokenKey,
        localStorage.getItem(tokenKey)
    );

    const [currentLocation, setCurrentLocation] =
        useLocalStorage<ClubhouseLocation | null>(
            locationKey,
            localStorage.getItem(locationKey) as ClubhouseLocation
        );

    const [currentUser, setCurrentUser] = useLocalStorage<string | null>(
        userKey,
        localStorage.getItem(userKey)
    );

    const [admin, setAdmin] = useLocalStorage<boolean | null>(
        adminKey,
        JSON.parse(String(localStorage.getItem(adminKey)))
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
                setAuthToken(data.token);
                setCurrentLocation(currentLocation);
                setCurrentUser(username);
                setAdmin(data.admin);
            }

            return data;
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        setAuthToken(null);
        setCurrentLocation(null);
        setCurrentUser(null);
        setAdmin(null);

        history.push('/login');
    };

    const isLoggedIn = () => !!authToken;

    return (
        <AuthContext.Provider
            value={{
                authToken,
                currentLocation,
                currentUser,
                admin,
                handleLogin,
                handleLogout,
                isLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

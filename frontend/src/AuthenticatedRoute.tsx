import { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { useAuthContext } from './context/AuthProvider';

type Props = RouteProps & { adminOnly?: boolean };

const Restricted: FC<Props> = ({ children, adminOnly }) => {
    const { currentUser, currentLocation, authToken, admin, isLoggedIn } =
        useAuthContext();

    if (!currentUser || !currentLocation || !authToken) {
        return <Redirect to="/" />;
    }

    if (isLoggedIn() && adminOnly && !admin) {
        return <Redirect to="/" />;
    }

    return <>{children}</>;
};

const AuthenticatedRoute: FC<Props> = ({ children, adminOnly, ...props }) => {
    return (
        <Route {...props}>
            <Restricted adminOnly={adminOnly}>{children}</Restricted>
        </Route>
    );
};

export default AuthenticatedRoute;

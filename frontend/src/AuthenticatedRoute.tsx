import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { useAuthContext } from './context/AuthProvider';

const AdminOnly: FC = ({ children }) => {
    const { currentUser, currentLocation } = useAuthContext();

    if (!currentUser || !currentLocation) {
        return <Redirect to="/" />;
    }

    return <>{children}</>;
};

const AdminRoute: FC<RouteProps> = ({ children, ...props }) => {
    return (
        <Route {...props}>
            <AdminOnly>{children}</AdminOnly>
        </Route>
    );
};

export default AdminRoute;

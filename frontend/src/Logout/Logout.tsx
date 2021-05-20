import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';

const Logout: FC = () => {
    const { handleLogout } = useAuthContext();
    handleLogout();
    return <Redirect to="/login" />;
};

export default Logout;

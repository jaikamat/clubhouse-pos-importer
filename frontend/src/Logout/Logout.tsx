import React, { FC, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const Logout: FC = () => {
    const { handleLogout } = useContext(AuthContext);
    handleLogout();
    return <Redirect to="/login" />;
};

export default Logout;

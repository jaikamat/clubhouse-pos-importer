import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

function Logout() {
    const { handleLogout } = useContext(AuthContext);

    handleLogout();

    return <Redirect to="/login" />
};

export default Logout;

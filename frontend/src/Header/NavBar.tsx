import React, { FC, useState } from 'react';
import {
    AppBar,
    Drawer,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useAuthContext } from '../context/AuthProvider';
import NavLinks from './NavLinks';

const useStyles = makeStyles({
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
});

const NavBar: FC<{}> = () => {
    const { loggedIn, currentLocation, currentUser } = useAuthContext();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const { title, list } = useStyles();

    return (
        <AppBar>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={title}>
                    Clubhouse Collection StoreName
                </Typography>
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <div className={list} onClick={() => setDrawerOpen(false)}>
                        <NavLinks />
                    </div>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

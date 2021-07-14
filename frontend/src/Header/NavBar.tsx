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
import { ClubhouseLocation, useAuthContext } from '../context/AuthProvider';
import NavLinks from './NavLinks';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(({ spacing }) => ({
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
    menuButton: {
        marginRight: spacing(2),
    },
}));

const getClubhouseLocationName = (location: ClubhouseLocation | null) => {
    if (location === 'ch1') return 'Beaverton';
    if (location === 'ch2') return 'Hillsboro';
    return '';
};

const NavBar: FC<{}> = () => {
    const { loggedIn, currentLocation, currentUser } = useAuthContext();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const { title, list, menuButton } = useStyles();

    return (
        <AppBar>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    className={menuButton}
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    color="inherit"
                    component={RouterLink}
                    variant="h6"
                    className={title}
                    to="/"
                >
                    Clubhouse Collection{' '}
                    {getClubhouseLocationName(currentLocation)}
                </Typography>
                <Typography
                    color="inherit"
                    component={RouterLink}
                    variant="button"
                    to="/public-inventory"
                >
                    Search cards
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

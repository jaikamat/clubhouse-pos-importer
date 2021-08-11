import React, { FC, useState } from 'react';
import {
    AppBar,
    Box,
    Drawer,
    Grid,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ClubhouseLocation, useAuthContext } from '../context/AuthProvider';
import NavLinks from './NavLinks';
import { Link as RouterLink } from 'react-router-dom';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { version } from '../../package.json';

const useStyles = makeStyles(({ spacing, typography, palette }) => ({
    title: {
        flexGrow: 1,
    },
    menuLinkText: {
        fontWeight: typography.fontWeightBold,
        '&:hover': {
            color: palette.common.white,
        },
    },
    list: {
        width: 250,
    },
    menuButton: {
        marginRight: spacing(2),
    },
}));

// TODO: This information needs to be populated on the backend via a collection of shop entities
const getClubhouseLocationName = (location: ClubhouseLocation | null) => {
    if (location === 'ch1') return 'Beaverton';
    if (location === 'ch2') return 'Hillsboro';
    return '';
};

const NavBar: FC<{}> = () => {
    const { isLoggedIn, currentLocation, currentUser } = useAuthContext();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const { title, list, menuButton, menuLinkText } = useStyles();

    return (
        <AppBar>
            <Toolbar>
                {isLoggedIn() && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        className={menuButton}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <div className={title}>
                    <Typography
                        color="inherit"
                        className={menuLinkText}
                        component={RouterLink}
                        variant="h6"
                        to="/"
                    >
                        Clubhouse Collection
                    </Typography>
                </div>
                <Typography
                    color="inherit"
                    className={menuLinkText}
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
                    <Box
                        py={2}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        height={1}
                    >
                        <div>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                justify="center"
                            >
                                <LocationOnIcon color="primary" />
                                <Typography color="primary" variant="h6">
                                    {getClubhouseLocationName(currentLocation)}
                                </Typography>
                            </Grid>
                            <Typography color="textSecondary" align="center">
                                Logged in as {currentUser}
                            </Typography>
                            <div
                                className={list}
                                onClick={() => setDrawerOpen(false)}
                            >
                                <NavLinks />
                            </div>
                        </div>
                        <Typography color="textSecondary" align="center">
                            Version {version}
                        </Typography>
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

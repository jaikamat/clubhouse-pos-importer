import { Divider, List, ListItem, ListItemIcon } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import QueueIcon from '@material-ui/icons/Queue';
import ViewListIcon from '@material-ui/icons/ViewList';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider';

const NavLinks: FC<{}> = () => {
    const { pathname } = useLocation();
    const { handleLogout } = useAuthContext();

    return (
        <List>
            <ListItem
                button
                component={RouterLink}
                to="/manage-inventory"
                selected={pathname === '/manage-inventory'}
                replace
            >
                <ListItemIcon>
                    <AddIcon color="primary" />
                </ListItemIcon>
                Manage Inventory
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/bulk-add"
                selected={pathname === '/bulk-add'}
                replace
            >
                <ListItemIcon>
                    <QueueIcon color="primary" />
                </ListItemIcon>
                Bulk Entry
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/new-sale"
                selected={pathname === '/new-sale'}
                replace
            >
                <ListItemIcon>
                    <AttachMoneyIcon color="primary" />
                </ListItemIcon>
                New Sale
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/receiving"
                selected={pathname === '/receiving'}
                replace
            >
                <ListItemIcon>
                    <ListAltIcon color="primary" />
                </ListItemIcon>
                Receiving
            </ListItem>
            <Divider />
            <ListItem
                button
                component={RouterLink}
                to="/browse-inventory"
                selected={pathname === '/browse-inventory'}
                replace
            >
                <ListItemIcon>
                    <BusinessCenterIcon color="primary" />
                </ListItemIcon>
                Browse Inventory
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/browse-sales"
                selected={pathname === '/browse-sales'}
                replace
            >
                <ListItemIcon>
                    <VisibilityIcon color="primary" />
                </ListItemIcon>
                Browse Sales
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/browse-receiving"
                selected={pathname === '/browse-receiving'}
                replace
            >
                <ListItemIcon>
                    <ViewListIcon color="primary" />
                </ListItemIcon>
                Browse Receiving
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/reporting"
                selected={pathname === '/reporting'}
                replace
            >
                <ListItemIcon>
                    <EqualizerIcon color="primary" />
                </ListItemIcon>
                Reporting (Beta)
            </ListItem>
            <Divider />
            <ListItem button onClick={() => handleLogout()}>
                <ListItemIcon>
                    <ExitToAppIcon color="primary" />
                </ListItemIcon>
                Log Out
            </ListItem>
        </List>
    );
};

export default NavLinks;

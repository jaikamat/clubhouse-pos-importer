import React, { FC } from 'react';
import { Divider, List, ListItem, ListItemIcon } from '@material-ui/core';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ViewListIcon from '@material-ui/icons/ViewList';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const NavLinks: FC<{}> = () => {
    const { pathname } = useLocation();

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
            <Divider />
            <ListItem
                button
                component={RouterLink}
                to="/logout"
                selected={pathname === '/logout'}
                replace
            >
                <ListItemIcon>
                    <ExitToAppIcon color="primary" />
                </ListItemIcon>
                Log out
            </ListItem>
        </List>
    );
};

export default NavLinks;

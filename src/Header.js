import React from 'react';
import { Menu } from 'semantic-ui-react';

class Header extends React.Component {
    render() {
        return (
            <Menu inverted color="blue" fixed="top">
                <Menu.Item name="Clubhouse Collection" />
                <Menu.Menu position="right">
                    <Menu.Item name="Manage Inventory" />
                    <Menu.Item name="Browse Inventory" />
                    <Menu.Item name="New Sale" />
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;

import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {
        return (
            <Menu inverted color="blue" fixed="top">
                <Menu.Item name="Clubhouse Collection" />
                <Menu.Menu position="right">
                    <Link to="/manage-inventory">
                        <Menu.Item name="Manage Inventory" />
                    </Link>
                    <Link to="/new-sale">
                        <Menu.Item name="New Sale" />
                    </Link>
                    {/* <Link to="/browse-inventory">
                        <Menu.Item name="Browse Inventory" />
                    </Link> */}
                    <Link to="/browse-sales">
                        <Menu.Item name="Browse Sales" />
                    </Link>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;

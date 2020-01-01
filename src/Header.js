import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {
        const { loggedIn } = this.props;
        return (
            <Menu inverted color="blue" fixed="top">
                <Menu.Item name="Clubhouse Collection" />
                <Menu.Menu position="right">
                    {loggedIn && (
                        <React.Fragment>
                            <Link to="/manage-inventory">
                                <Menu.Item name="Manage Inventory" />
                            </Link>
                            <Link to="/new-sale">
                                <Menu.Item name="New Sale" />
                            </Link>
                            <Link to="/browse-sales">
                                <Menu.Item name="Browse Sales" />
                            </Link>
                        </React.Fragment>
                    )}
                    {!loggedIn && (
                        <Link to="/login">
                            <Menu.Item name="login" />
                        </Link>
                    )}
                    {loggedIn && (
                        <Link to="/logout">
                            <Menu.Item name="logout" />
                        </Link>
                    )}
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;

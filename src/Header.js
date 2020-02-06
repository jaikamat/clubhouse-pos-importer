import React from 'react';
import ballLogo from './logos/magic-ball.png'
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const style = {
    background: "linear-gradient(#2185d0, #206ac6)",
    boxShadow: '0 3px 5px 0 rgba(0,0,0,.25)'
}

class Header extends React.Component {
    render() {
        return (
            <AuthContext.Consumer>
                {({ loggedIn }) => {
                    return (
                        <Menu inverted fixed="top" style={style}>
                            <Menu.Item>
                                <img src={ballLogo} style={{ marginRight: '7px' }} alt="logo" />
                                <span><h3>Clubhouse Collection</h3></span>
                            </Menu.Item>
                            <Menu.Menu position="right">
                                <Menu.Item position="right" as={Link} to="/public-inventory">Search</Menu.Item>
                                {loggedIn && <Dropdown item icon="bars">
                                    <Dropdown.Menu>
                                        <React.Fragment>
                                            <Dropdown.Item as={Link} to="/manage-inventory"><Icon name="plus" color="blue" />Manage Inventory</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/new-sale" ><Icon name="dollar sign" color="blue" />New Sale</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/receiving" ><Icon name="list alternate outline" color="blue" />Receiving</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as={Link} to="/browse-inventory" ><Icon name="box" color="blue" />Browse Inventory</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/browse-sales" ><Icon name="eye" color="blue" />Browse Sales</Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item as={Link} to="/logout" ><Icon name="log out" color="blue" />Logout</Dropdown.Item>
                                        </React.Fragment>
                                    </Dropdown.Menu>
                                </Dropdown>}
                                {!loggedIn && <Menu.Item position="right" as={Link} to="/login">Log in</Menu.Item>}
                            </Menu.Menu>
                        </Menu >
                    );
                }}
            </AuthContext.Consumer>
        );
    }
}

export default Header;

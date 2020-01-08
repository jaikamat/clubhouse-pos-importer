import React from 'react';
import ballLogo from './logos/magic-ball.png'
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    render() {
        const { loggedIn } = this.props;
        return (
            <Menu inverted color="blue" fixed="top" style={{ boxShadow: '0 3px 5px 0 rgba(0,0,0,.25)' }}>
                <Menu.Item>
                    <img src={ballLogo} style={{ marginRight: '7px' }} alt="logo" />
                    <span><h3>Clubhouse Collection</h3></span>
                </Menu.Item>
                <Menu.Menu position="right">
                    {loggedIn && <Dropdown item icon="bars">
                        <Dropdown.Menu>
                            <React.Fragment>
                                <Dropdown.Item as={Link} to="/manage-inventory"><Icon name="plus" color="blue" />Manage Inventory</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/new-sale" ><Icon name="dollar sign" color="blue" />New Sale</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/browse-sales" ><Icon name="eye" color="blue" />Browse Sales</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/logout" ><Icon name="log out" color="blue" />Logout</Dropdown.Item>
                            </React.Fragment>
                        </Dropdown.Menu>
                    </Dropdown>}
                    {!loggedIn && <Menu.Item position="right" as={Link} to="/login">Log in</Menu.Item>}
                </Menu.Menu>
            </Menu >
        );
    }
}

export default Header;

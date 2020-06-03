import React, { useContext } from 'react';
import ballLogo from './logos/magic-ball.png'
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const style = {
    background: "linear-gradient(#2185d0, #206ac6)",
    boxShadow: '0 3px 5px 0 rgba(0,0,0,.25)'
}

function Header(props) {
    const { loggedIn } = useContext(AuthContext);
    const { pathname } = props.location;

    return <Menu inverted fixed="top" style={style}>
        <Menu.Item as={Link} replace to="/">
            <img src={ballLogo} style={{ marginRight: '7px' }} alt="logo" />
            <span><h3>Clubhouse Collection</h3></span>
        </Menu.Item>
        <Menu.Menu position="right">
            <Menu.Item active={pathname === '/public-inventory'} position="right" as={Link} replace to="/public-inventory">
                Search
            </Menu.Item>
            {loggedIn && <Dropdown item icon="bars">
                <Dropdown.Menu>
                    <Dropdown.Item active={pathname === '/manage-inventory'} as={Link} replace to="/manage-inventory">
                        <Icon name="plus" color="blue" />Manage Inventory
                    </Dropdown.Item>
                    <Dropdown.Item active={pathname === '/new-sale'} as={Link} replace to="/new-sale" >
                        <Icon name="dollar sign" color="blue" />New Sale
                    </Dropdown.Item>
                    <Dropdown.Item active={pathname === '/receiving'} as={Link} replace to="/receiving" >
                        <Icon name="list alternate outline" color="blue" />Receiving
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item active={pathname === '/browse-inventory'} as={Link} replace to="/browse-inventory" >
                        <Icon name="box" color="blue" />Browse Inventory
                    </Dropdown.Item>
                    <Dropdown.Item active={pathname === '/browse-sales'} as={Link} replace to="/browse-sales" >
                        <Icon name="eye" color="blue" />Browse Sales
                    </Dropdown.Item>
                    <Dropdown.Item active={pathname === '/reports'} as={Link} replace to="/reports" >
                        <Icon name="chart bar" color="blue" />Reporting (Beta)
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item active={pathname === '/logout'} as={Link} replace to="/logout" >
                        <Icon name="log out" color="blue" />Log out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>}
        </Menu.Menu>
    </Menu >
}

export default withRouter(props => <Header {...props} />);

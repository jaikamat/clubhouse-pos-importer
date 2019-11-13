import React from 'react';
import { Menu } from 'semantic-ui-react';

class Header extends React.Component {
    render() {
        return (
            <Menu inverted color="blue" fixed="top">
                <Menu.Item name="Clubhouse Collection" />
            </Menu>
        );
    }
}

export default Header;

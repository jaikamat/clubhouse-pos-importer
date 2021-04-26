import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import Price from '../common/Price';
import TooltipImage from '../common/TooltipImage';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

export default class DeckboxCloneRow extends React.Component {
    state = { mouseInside: false, mouseX: 0, mouseY: 0 };

    mouseEnter = (e) => {
        const mouseX = e.clientX - e.target.offsetLeft
        const mouseY = e.clientY - e.target.offsetTop;
        this.setState({ mouseInside: true, mouseX, mouseY });
    }

    mouseLeave = (e) => this.setState({ mouseInside: false });

    mouseMove = (e) => {
        const mouseX = e.clientX - e.target.offsetLeft
        const mouseY = e.clientY - e.target.offsetTop;
        this.setState({ mouseX, mouseY });
    };

    render() {
        const { inventory, name, set_name, price, set, rarity, image_uri } = this.props;
        const { mouseInside, mouseX } = this.state;
        const finish = inventory.k.split('_')[0];
        const condition = inventory.k.split('_')[1];

        return <Table.Row>
            <Table.Cell>
                <span
                    onMouseEnter={this.mouseEnter}
                    onMouseLeave={this.mouseLeave}
                    onMouseMove={this.mouseMove}
                    style={{ cursor: 'help' }}
                >
                    {name}{' '}
                </span>
                {finish === 'FOIL' && <Icon name="star" color="blue" />}
                {mouseInside && <TooltipImage image_uri={image_uri} posX={mouseX} />}
            </Table.Cell>
            <Table.Cell><i className={`ss ss-fw ss-${set} ss-${rarity}`} style={{ fontSize: '20px' }} />{" "}{set_name}</Table.Cell>
            <Table.Cell>{conditionMap[condition]}</Table.Cell>
            <Table.Cell>{inventory.v}</Table.Cell>
            <Table.Cell><Price num={price} /></Table.Cell>
        </Table.Row>
    }
}
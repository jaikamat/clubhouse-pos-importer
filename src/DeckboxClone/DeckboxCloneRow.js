import React from 'react';
import { Table, Icon, Image } from 'semantic-ui-react';
import Price from '../common/Price';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

const Tooltip = ({ image_uri, posX, posY }) => {
    return (
        <div style={{
            position: 'absolute',
            left: `${posX}px`,
            width: '150px', // Width of the image when size="small"
            height: '209px', // Height of the image when size="small"
            borderRadius: '7px 7px 7px 7px',
            boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.25)',
            background: 'repeating-linear-gradient(45deg, #bfbfbf, #bfbfbf 10px, #b0b0b0 10px, #b0b0b0 20px)'
        }}>
            <Image
                style={{ borderRadius: '7px 7px 7px 7px' }}
                size="small"
                src={image_uri}
            />
        </div>
    )
}

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
        const { mouseInside, mouseX, mouseY } = this.state;
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
                {mouseInside && <Tooltip image_uri={image_uri} posX={mouseX} posY={mouseY} />}
            </Table.Cell>
            <Table.Cell><i className={`ss ss-fw ss-${set} ss-${rarity}`} style={{ fontSize: '20px' }} />{" "}{set_name}</Table.Cell>
            <Table.Cell>{conditionMap[condition]}</Table.Cell>
            <Table.Cell>{inventory.v}</Table.Cell>
            <Table.Cell><Price num={price} /></Table.Cell>
        </Table.Row>
    }
}
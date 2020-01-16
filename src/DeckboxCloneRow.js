import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import Price from './Price';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

export default class DeckboxCloneRow extends React.Component {
    render() {
        const { inventory, name, set_name, price, set, rarity } = this.props;
        const finish = inventory.k.split('_')[0];
        const condition = inventory.k.split('_')[1];

        return <Table.Row>
            <Table.Cell>
                {name}{' '}
                {finish === 'FOIL' && <Icon name="star" color="blue" />}
            </Table.Cell>
            <Table.Cell><i className={`ss ss-fw ss-${set} ss-${rarity}`} style={{ fontSize: '20px' }} />{" "}{set_name}</Table.Cell>
            <Table.Cell>{conditionMap[condition]}</Table.Cell>
            <Table.Cell>{inventory.v}</Table.Cell>
            <Table.Cell><Price num={price} /></Table.Cell>
        </Table.Row>
    }
}
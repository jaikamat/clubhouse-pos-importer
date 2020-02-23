import React from 'react';
import QohLabels from './QohLabels';
import { Table } from 'semantic-ui-react';

const InventoryTableRow = ({ name, set_name, set, rarity, qoh }) => {
    return (
        <Table.Row>
            <Table.Cell>
                <i
                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                    style={{ fontSize: '30px' }}
                />
                <span> {name}</span>
            </Table.Cell>
            <Table.Cell>{set_name}</Table.Cell>
            <Table.Cell>
                <QohLabels inventoryQty={qoh} />
            </Table.Cell>
        </Table.Row>
    );
};

export default InventoryTableRow;

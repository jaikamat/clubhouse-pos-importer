import React from 'react';
import { Button, Icon, Label, Table } from 'semantic-ui-react';
import Price from './Price';

export default function SaleLineItem(props) {
    const {
        name,
        set,
        // set_name,
        finishCondition,
        qtyToSell,
        price,
        rarity,
        deleteLineItem,
        id
    } = props;

    return (
        <Table.Row>
            <Table.Cell><h4>{name}</h4></Table.Cell>
            <Table.Cell singleLine>
                <i
                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                    style={{ fontSize: '20px' }}
                />
                <Label color="grey">{set.toUpperCase()}</Label>
            </Table.Cell>
            <Table.Cell>
                {qtyToSell}x @ <Price num={price} /> | {finishCondition}
            </Table.Cell>
            <Table.Cell>
                <Button
                    icon
                    onClick={() => deleteLineItem(id, finishCondition)}
                >
                    <Icon name="cancel"></Icon>
                </Button>
            </Table.Cell>
        </Table.Row>
    );
}

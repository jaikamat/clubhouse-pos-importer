import React, { useState } from 'react';
import { Button, Label, Table } from 'semantic-ui-react';
import Price from '../Price';

export default function SaleLineItem(props) {
    const {
        name,
        set,
        finishCondition,
        qtyToSell,
        price,
        rarity,
        deleteLineItem,
        id
    } = props;

    const [hovered, setHovered] = useState(false);

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
                    icon="cancel"
                    circular
                    onClick={() => deleteLineItem(id, finishCondition)}
                    onMouseOver={() => setHovered(true)}
                    onMouseOut={() => setHovered(false)}
                    color={hovered ? 'red' : null}
                >
                </Button>
            </Table.Cell>
        </Table.Row>
    );
}

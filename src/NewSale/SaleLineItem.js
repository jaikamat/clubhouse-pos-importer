import React, { useState, useContext } from 'react';
import { Button, Label, Table } from 'semantic-ui-react';
import { SaleContext } from '../context/SaleContext';
import Price from '../common/Price';

export default function SaleLineItem({ displayName, set, finishCondition, qtyToSell, price, rarity, id }) {
    const [hovered, setHovered] = useState(false);

    const { removeFromSaleList } = useContext(SaleContext);

    return (
        <Table.Row>
            <Table.Cell><h4>{displayName}</h4></Table.Cell>
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
                    onClick={() => removeFromSaleList(id, finishCondition)}
                    onMouseOver={() => setHovered(true)}
                    onMouseOut={() => setHovered(false)}
                    color={hovered ? 'red' : null}
                >
                </Button>
            </Table.Cell>
        </Table.Row>
    );
}

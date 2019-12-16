import React from 'react';
import { Card, Button, Icon, Header, Label } from 'semantic-ui-react';
import Price from './Price';

export default function SaleLineItem(props) {
    const {
        name,
        set,
        set_name,
        finishCondition,
        qtyToSell,
        price,
        rarity,
        deleteLineItem,
        id
    } = props;

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header as="h4">
                    {name} <i className={`ss ss-fw ss-${set} ss-${rarity}`} />
                    <Label horizontal>
                        {set_name} ({set.toUpperCase()})
                    </Label>
                </Card.Header>
                <span>
                    {qtyToSell}x @ <Price num={price} /> | {finishCondition}
                </span>
                <Card.Description></Card.Description>
            </Card.Content>
            <Button
                style={{ color: 'D3D3D3' }}
                icon
                onClick={() => deleteLineItem(id, finishCondition)}
            >
                <Icon name="cancel"></Icon>
            </Button>
        </Card>
    );
}

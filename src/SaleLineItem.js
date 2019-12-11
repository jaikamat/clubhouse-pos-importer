import React from 'react';
import { Segment, Button, Icon, Header, Label } from 'semantic-ui-react';
import Price from './Price';

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

    return (
        <Segment>
            <Header as="h4">
                {name} <i className={`ss ss-fw ss-${set} ss-${rarity}`} />
                <Label horizontal>{String(set).toUpperCase()}</Label>
                <span>
                    {finishCondition} | {qtyToSell} | <Price num={price} />
                </span>
            </Header>
            <Button
                primary
                icon
                onClick={() => deleteLineItem(id, finishCondition)}
            >
                <Icon name="cancel"></Icon>
            </Button>
        </Segment>
    );
}

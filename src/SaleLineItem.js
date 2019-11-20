import React from 'react';
import { Segment, Button, Icon, Header, Label } from 'semantic-ui-react';

export default function SaleLineItem(props) {
    const deleteLineItem = () => {
        props.deleteLineItem(props.id, props.finishCondition);
    };

    const { name, set, finishCondition, qtyToSell, price, rarity } = props;

    return (
        <Segment>
            <Header as="h4">
                {name} <i className={`ss ss-fw ss-${set} ss-${rarity}`} />
                <Label horizontal>{String(set).toUpperCase()}</Label>
                <span>
                    {finishCondition} | {qtyToSell} | {price}
                </span>
            </Header>
            <Button primary icon onClick={deleteLineItem}>
                <Icon name="cancel"></Icon>
            </Button>
        </Segment>
    );
}

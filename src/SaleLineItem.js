import React from 'react';
import { Segment, Button, Icon } from 'semantic-ui-react';

export default function SaleLineItem(props) {
    const deleteLineItem = () => {
        props.deleteLineItem(props.id, props.finishCondition);
    };

    return (
        <Segment>
            <span>
                {props.name} | {props.set.toUpperCase()} |{' '}
                {props.finishCondition} | {props.qtyToSell} | {props.price}
            </span>
            <Button primary icon onClick={deleteLineItem}>
                <Icon name="cancel"></Icon>
            </Button>
        </Segment>
    );
}

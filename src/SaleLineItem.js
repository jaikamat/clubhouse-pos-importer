import React from 'react';
import { Segment } from 'semantic-ui-react';

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
            <p onClick={deleteLineItem}>X</p>
        </Segment>
    );
}

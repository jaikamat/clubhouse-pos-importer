import React from 'react';
import ManageInventoryListItem from './ManageInventoryListItem';

export default function ManageInventoryList(props) {
    return props.cards.map((card) => {
        return (
            <ManageInventoryListItem key={card.id} {...card} qoh={card.qoh} />
        );
    });
}

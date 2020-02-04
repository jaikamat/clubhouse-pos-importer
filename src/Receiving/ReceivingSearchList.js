import React from 'react';
import ReceivingCardItem from './ReceivingSearchItem';

export default function ReceivingCardList({ cards, addToList }) {
    return cards.map(c => {
        return <ReceivingCardItem
            key={c.id}
            {...c}
            addToList={addToList}
        />
    });
}

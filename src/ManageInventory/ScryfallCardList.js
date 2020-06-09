import React from 'react';
import ScryfallCardListItem from './ScryfallCardListItem';

export default function ScryfallCardList(props) {
    return props.cards.map(card => {
        return <ScryfallCardListItem
            key={card.id}
            {...card}
            qoh={card.qoh}
        />
    });
}

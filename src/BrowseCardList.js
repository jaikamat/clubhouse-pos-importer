import React from 'react';
import BrowseCardItem from './BrowseCardItem';

export default function BrowseCardList(props) {
    const cardList = props.cards.map(card => {
        return <BrowseCardItem key={card.id} {...card} />;
    });

    return cardList;
}

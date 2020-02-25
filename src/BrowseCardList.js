import React from 'react';
import BrowseCardItem from './BrowseCardItem';

export default function BrowseCardList(props) {
    const { cards, addToSaleList } = props;

    return cards.map(card => {
        return (
            <BrowseCardItem
                key={card.id}
                {...card}
                addToSaleList={addToSaleList}
            />
        );
    });
}

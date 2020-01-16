import React from 'react';
import BrowseCardItem from './BrowseCardItem';
import $ from 'jquery'

export default function BrowseCardList(props) {
    const { cards, addToSaleList } = props;

    // Highlight the input if cards were not found
    if (cards.length === 0) {
        $('#searchBar').focus().select();
    }

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

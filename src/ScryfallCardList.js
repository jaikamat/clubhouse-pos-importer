import React from 'react';
import ScryfallCardListItem from './ScryfallCardListItem';

function ScryfallCardList(props) {
    const cardList = props.cards.map(card => {
        return (
            <ScryfallCardListItem
                key={card.id}
                {...card}
                qoh={card.qoh}
            />
        );
    });

    return cardList
}

export default ScryfallCardList;

import React from 'react';
import ScryfallCardListItem from './ScryfallCardListItem';

function ScryfallCardList(props) {
    // Tie the QOH to the fetched card, if it exists!
    const cardList = props.cards.map(card => {
        return (
            <ScryfallCardListItem
                showImage={props.showImages}
                key={card.id}
                {...card}
                inventoryQty={props.quantities[card.id]}
            />
        );
    });

    return cardList
}

export default ScryfallCardList;

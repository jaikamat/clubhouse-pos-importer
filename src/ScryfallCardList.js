import React from 'react';
import { Segment } from 'semantic-ui-react';
import ScryfallCardListItem from './ScryfallCardListItem';

function ScryfallCardList(props) {
    // Tie the QOH to the fetched card, if it exists!
    const cardList = props.cards.map(card => {
        return (
            <ScryfallCardListItem
                key={card.id}
                {...card}
                inventoryQty={props.quantities[card.id]}
            />
        );
    });

    return <Segment.Group>{cardList}</Segment.Group>;
}

export default ScryfallCardList;

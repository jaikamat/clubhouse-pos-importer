import React from 'react';
import { Segment } from 'semantic-ui-react';
import ScryfallCardListItem from './ScryfallCardListItem';

function ScryfallCardList(props) {
    const cardList = props.cards.map(card => {
        return <ScryfallCardListItem key={card.id} {...card} />;
    });

    return <Segment.Group>{cardList}</Segment.Group>;
}

export default ScryfallCardList;

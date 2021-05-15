import React, { useContext } from 'react';
import ReceivingSearchItem from './ReceivingSearchItem';
import { ReceivingContext } from '../context/ReceivingContext';

export default function ReceivingCardList() {
    const { searchResults } = useContext(ReceivingContext);

    return searchResults.map((card) => {
        return <ReceivingSearchItem key={card.id} card={card} qoh={card.qoh} />;
    });
}

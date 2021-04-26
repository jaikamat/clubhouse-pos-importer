import React, { useContext } from 'react';
import ReceivingSearchItem from './ReceivingSearchItem';
import { ReceivingContext } from '../context/ReceivingContext';

export default function ReceivingCardList() {
    const { searchResults } = useContext(ReceivingContext);

    return searchResults.map(c => {
        return <ReceivingSearchItem
            key={c.id}
            {...c}
            qoh={c.qoh}
        />
    });
}

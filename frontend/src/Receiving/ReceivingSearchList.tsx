import React, { FC, useContext } from 'react';
import ReceivingSearchItem from './ReceivingSearchItem';
import { ReceivingContext } from '../context/ReceivingContext';

interface Props {}

const ReceivingCardList: FC<Props> = () => {
    const { searchResults } = useContext(ReceivingContext);

    return (
        <>
            {searchResults.map((card) => {
                return <ReceivingSearchItem key={card.id} card={card} />;
            })}
        </>
    );
};

export default ReceivingCardList;

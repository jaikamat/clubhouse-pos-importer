import { List, Paper } from '@material-ui/core';
import React, { FC } from 'react';
import { ReceivingCard } from '../context/ReceivingContext';
import ReceivingCartItem from './ReceivingCartItem';
import ReceivingListTotals from './ReceivingListTotals';

interface Props {
    cards: ReceivingCard[];
}

const ReceivingCart: FC<Props> = ({ cards }) => {
    return (
        <>
            {cards.length > 0 && (
                <List component={Paper} variant="outlined">
                    {cards.map((card) => (
                        <ReceivingCartItem card={card} />
                    ))}
                </List>
            )}
            {cards.length > 0 && <ReceivingListTotals />}
        </>
    );
};

export default ReceivingCart;

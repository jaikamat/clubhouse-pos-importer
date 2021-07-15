import React, { FC } from 'react';
import { Segment } from 'semantic-ui-react';
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
                <Segment.Group>
                    {cards.map((card) => (
                        <ReceivingCartItem card={card} />
                    ))}
                </Segment.Group>
            )}
            {cards.length > 0 && <ReceivingListTotals />}
        </>
    );
};

export default ReceivingCart;

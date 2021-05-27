import React, { FC } from 'react';
import { Segment } from 'semantic-ui-react';
import { ReceivingCard } from '../context/ReceivingContext';
import ReceivingListItem from './ReceivingListItem';
import ReceivingListTotals from './ReceivingListTotals';

interface Props {
    cards: ReceivingCard[];
}

const ReceivingList: FC<Props> = ({ cards }) => {
    return (
        <>
            {cards.length > 0 && (
                <Segment.Group>
                    {cards.map((card) => (
                        <ReceivingListItem card={card} />
                    ))}
                </Segment.Group>
            )}
            {cards.length > 0 && <ReceivingListTotals />}
        </>
    );
};

export default ReceivingList;

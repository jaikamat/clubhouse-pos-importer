import React, { FC } from 'react';
import { Table } from 'semantic-ui-react';
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
                <Table compact size="small">
                    <Table.Body className="receiving-list-table">
                        {cards.map((card) => (
                            <ReceivingListItem card={card} />
                        ))}
                    </Table.Body>
                </Table>
            )}
            {cards.length > 0 && <ReceivingListTotals />}
        </>
    );
};

export default ReceivingList;

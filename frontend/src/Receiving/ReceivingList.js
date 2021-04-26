import React from 'react';
import { Table } from 'semantic-ui-react';
import ReceivingListItem from './ReceivingListItem';
import ReceivingListTotals from './ReceivingListTotals';

export default function ReceivingList({ cards }) {
    return <React.Fragment>
        {cards.length > 0 && <Table compact size="small">
            <Table.Body className='receiving-list-table'>
                {cards.map(card => {
                    const { name, display_name, set, rarity, cashPrice, creditPrice, finishCondition, uuid_key, tradeType, qoh, cardImage } = card;
                    return <ReceivingListItem
                        name={name}
                        display_name={display_name}
                        set={set}
                        rarity={rarity}
                        cashPrice={cashPrice}
                        creditPrice={creditPrice}
                        finishCondition={finishCondition}
                        uuid_key={uuid_key}
                        tradeType={tradeType}
                        qoh={qoh}
                        key={uuid_key}
                        cardImage={cardImage}
                    />
                })}
            </Table.Body>
        </Table>}

        {cards.length > 0 && <ReceivingListTotals />}
    </React.Fragment>
}
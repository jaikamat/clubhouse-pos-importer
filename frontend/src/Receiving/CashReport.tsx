import React, { FC } from 'react';
import _ from 'lodash';
import Price from '../common/Price';
import { Table } from 'semantic-ui-react';
import { ReceivingCard } from '../context/ReceivingContext';

interface Props {
    receivingList: ReceivingCard[];
}

// Am I crazy or is this logic really convoluted?
// Perhaps look at this down the line for improvement...
const CashReport: FC<Props> = ({ receivingList }) => {
    // If id, cashPrice and marketPrice are the same, goes in one bucket
    const countByPriceAndID = _.chain(receivingList)
        .filter((c) => c.tradeType === 'CASH')
        .map((c) => {
            // Note: We're creating a unique uuid-esque comparator string based on:
            // `id`, `cashPrice`, `marketPrice`, and `finishCondition`
            return {
                ...c,
                temp_uuid: `${c.id}-${c.cashPrice}-${c.marketPrice}-${c.finishCondition}`,
            };
        })
        .groupBy('temp_uuid')
        .mapValues((val) => val.length)
        .value();

    const uniqLineItems = _.chain(receivingList)
        .filter((c) => c.tradeType === 'CASH')
        .map((c) => {
            return {
                ...c,
                temp_uuid: `${c.id}-${c.cashPrice}-${c.marketPrice}-${c.finishCondition}`,
            };
        })
        .uniqBy('temp_uuid')
        .value();

    const mergedWithQty = uniqLineItems.map((c) => {
        return { ...c, tradeQty: countByPriceAndID[c.temp_uuid] }; // Add a trade quantity referencing the previous count
    });

    const totalCashOut = _.chain(receivingList)
        .filter((c) => c.tradeType === 'CASH')
        .sumBy((c) => c.cashPrice || 0)
        .value();

    return (
        <React.Fragment>
            <div id="cash-report">
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan={6}>
                                Employee Name:
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell>Card Name</Table.HeaderCell>
                            <Table.HeaderCell>Market Value</Table.HeaderCell>
                            <Table.HeaderCell>Condition</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Cash Offer</Table.HeaderCell>
                            <Table.HeaderCell>Cash Out</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mergedWithQty.map((c) => {
                            return (
                                <Table.Row key={c.temp_uuid}>
                                    <Table.Cell>{c.name}</Table.Cell>
                                    <Table.Cell>
                                        <Price num={c.marketPrice} />
                                    </Table.Cell>
                                    <Table.Cell>{c.finishCondition}</Table.Cell>
                                    <Table.Cell>{c.tradeQty}</Table.Cell>
                                    <Table.Cell>
                                        <Price num={c.cashPrice} />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Price
                                            num={
                                                c.tradeQty * (c.cashPrice || 0)
                                            }
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                    <Table.Footer>
                        <Table.HeaderCell colSpan={6}>
                            Total: <Price num={totalCashOut} />
                        </Table.HeaderCell>
                    </Table.Footer>
                </Table>
            </div>
        </React.Fragment>
    );
};

export default CashReport;

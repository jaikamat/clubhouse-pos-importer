import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
} from '@material-ui/core';
import _ from 'lodash';
import React, { FC } from 'react';
import Price from '../common/Price';
import { ReceivingCard } from '../context/ReceivingContext';
import displayFinishCondition from '../utils/displayFinishCondition';

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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={6}>Employee Name:</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Card Name</TableCell>
                            <TableCell>Market Value</TableCell>
                            <TableCell>Finish (Condition)</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Cash Offer</TableCell>
                            <TableCell>Cash Out</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mergedWithQty.map((c) => {
                            return (
                                <TableRow key={c.temp_uuid}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>
                                        <Price num={c.marketPrice} />
                                    </TableCell>
                                    <TableCell>
                                        {displayFinishCondition(
                                            c.finishCondition
                                        )}
                                    </TableCell>
                                    <TableCell>{c.tradeQty}</TableCell>
                                    <TableCell>
                                        <Price num={c.cashPrice} />
                                    </TableCell>
                                    <TableCell>
                                        <Price
                                            num={
                                                c.tradeQty * (c.cashPrice || 0)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableCell colSpan={6}>
                            Total: <Price num={totalCashOut} />
                        </TableCell>
                    </TableFooter>
                </Table>
            </div>
        </React.Fragment>
    );
};

export default CashReport;

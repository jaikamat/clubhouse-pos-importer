import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import React, { FC, useState } from 'react';
import Button from '../ui/Button';
import { AddedCard } from './BulkInventory';

interface Props {
    cards: AddedCard[];
    onRemove: (values: AddedCard) => void;
}

const SubmittedCardsTable: FC<Props> = ({ cards, onRemove }) => {
    const [onRemoveLoading, setOnRemoveLoading] = useState<boolean>(false);

    const doRemove = async (card: AddedCard) => {
        try {
            setOnRemoveLoading(true);
            await onRemove(card);
        } catch (e) {
            console.log(e);
        } finally {
            setOnRemoveLoading(false);
        }
    };

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>Name</b>
                        </TableCell>
                        <TableCell>
                            <b>Quantity</b>
                        </TableCell>
                        <TableCell>
                            <b>Finish</b>
                        </TableCell>
                        <TableCell>
                            <b>Condition</b>
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards
                        .filter((c) => !!c.bulkCard)
                        .map((c) => {
                            if (c.bulkCard) {
                                const {
                                    bulkCard,
                                    quantity,
                                    finish,
                                    condition,
                                } = c;

                                return (
                                    <TableRow
                                        key={`${
                                            c.bulkCard.scryfall_id
                                        }-${Math.random()}`}
                                    >
                                        <TableCell>
                                            {bulkCard.display_name}
                                        </TableCell>
                                        <TableCell>{quantity}</TableCell>
                                        <TableCell>{finish}</TableCell>
                                        <TableCell>{condition}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                onClick={() => doRemove(c)}
                                                disabled={onRemoveLoading}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            } else return null;
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SubmittedCardsTable;

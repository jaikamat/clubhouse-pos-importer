import React, { FC } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { FormValues } from './BulkInventory';

interface Props {
    cards: FormValues[];
}

const SubmittedCardsTable: FC<Props> = ({ cards }) => {
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards.map((c) => {
                        if (c.bulkCard) {
                            const { bulkCard, quantity, finish, condition } = c;

                            return (
                                <TableRow key={c.bulkCard.scryfall_id}>
                                    <TableCell>
                                        {bulkCard.display_name}
                                    </TableCell>
                                    <TableCell>{quantity}</TableCell>
                                    <TableCell>{finish}</TableCell>
                                    <TableCell>{condition}</TableCell>
                                </TableRow>
                            );
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SubmittedCardsTable;

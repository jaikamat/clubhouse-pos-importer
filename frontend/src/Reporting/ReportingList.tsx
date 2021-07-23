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
import { uniqueId } from 'lodash';

interface Card {
    count: number;
    name: string;
}

interface Props {
    cards: Card[];
}

const ReportingList: FC<Props> = ({ cards }) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>Quantity sold</b>
                        </TableCell>
                        <TableCell>
                            <b>Card name</b>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards.map((c) => (
                        <TableRow key={uniqueId()}>
                            <TableCell>{c.count}</TableCell>
                            <TableCell>{c.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReportingList;

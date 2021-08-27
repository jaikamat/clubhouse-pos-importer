import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import React, { FC } from 'react';
import BrowseSalesItem from './BrowseSalesItem';
import { Sale } from './browseSalesQuery';

interface Props {
    list: Sale[];
}

const BrowseSalesList: FC<Props> = ({ list }) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Sale ID</TableCell>
                        <TableCell>Date of Sale</TableCell>
                        <TableCell>Quantity Sold</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((sale) => (
                        <BrowseSalesItem sale={sale} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BrowseSalesList;

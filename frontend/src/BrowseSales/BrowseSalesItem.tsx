import { TableCell, TableRow } from '@material-ui/core';
import React, { FC } from 'react';
import formatDate from '../utils/formatDate';
import sum from '../utils/sum';
import { Sale } from './browseSalesQuery';

interface Props {
    sale: Sale;
}

const BrowseSalesItem: FC<Props> = ({ sale }) => {
    const { card_list, sale_data } = sale;

    const quantitySold = sum(card_list.map((c) => Number(c.qtyToSell)));

    return (
        <TableRow>
            <TableCell>{sale_data.saleID}</TableCell>
            <TableCell>{formatDate(sale_data.createTime)}</TableCell>
            <TableCell>{quantitySold}</TableCell>
        </TableRow>
    );
};

export default BrowseSalesItem;

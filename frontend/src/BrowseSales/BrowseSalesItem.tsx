import React, { FC } from 'react';
import sum from '../utils/sum';
import { Sale } from './browseSalesQuery';
import formatDate from '../utils/formatDate';
import { TableCell, TableRow } from '@material-ui/core';

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

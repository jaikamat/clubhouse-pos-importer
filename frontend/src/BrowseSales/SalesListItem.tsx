import React, { FC } from 'react';
import { Table } from 'semantic-ui-react';
import sum from '../utils/sum';
import { Sale } from './browseSalesQuery';
import formatDate from '../utils/formatDate';

interface Props {
    sale: Sale;
}

const SalesListItem: FC<Props> = ({ sale }) => {
    const { card_list, sale_data } = sale;

    const quantitySold = sum(card_list.map((c) => Number(c.qtyToSell)));

    return (
        <Table.Row>
            <Table.Cell>{sale_data.saleID}</Table.Cell>
            <Table.Cell>{formatDate(sale_data.createTime)}</Table.Cell>
            <Table.Cell>{quantitySold}</Table.Cell>
        </Table.Row>
    );
};

export default SalesListItem;

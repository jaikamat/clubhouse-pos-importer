import React, { FC } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import { Sale } from './SalesList';
import sum from '../utils/sum';

interface Props {
    sale: Sale;
}

const SalesListItem: FC<Props> = ({ sale }) => {
    const { card_list, sale_data } = sale;

    const quantitySold = sum(card_list.map((c) => Number(c.qtyToSell)));

    return (
        <Table.Row>
            <Table.Cell>{sale_data.saleID}</Table.Cell>
            <Table.Cell>
                {moment(sale_data.createTime).format('MM/DD/YYYY - h:mm A')}
            </Table.Cell>
            <Table.Cell>{quantitySold}</Table.Cell>
        </Table.Row>
    );
};

export default SalesListItem;

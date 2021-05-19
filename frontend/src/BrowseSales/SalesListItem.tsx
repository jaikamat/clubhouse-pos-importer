import React, { FC } from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import { Sale } from './SalesList';

interface Props {
    sale: Sale;
}

const SalesListItem: FC<Props> = ({ sale }) => {
    const { card_list, sale_data } = sale;

    const quantitySold = card_list
        .map((c) => Number(c.qtyToSell))
        .reduce((pre, curr) => pre + curr, 0);

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

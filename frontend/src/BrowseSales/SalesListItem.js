import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

const SalesListItem = ({ saleData, cardList }) => {
    const quantitySold = cardList.reduce(
        (pre, curr) => pre + curr.qtyToSell,
        0
    );

    return (
        <Table.Row>
            <Table.Cell>{saleData.saleID}</Table.Cell>
            <Table.Cell>
                {moment(saleData.createTime).format('MM/DD/YYYY - h:mm A')}
            </Table.Cell>
            <Table.Cell>{quantitySold}</Table.Cell>
        </Table.Row>
    );
};

export default SalesListItem;

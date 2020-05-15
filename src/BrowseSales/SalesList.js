import React from 'react';
import SalesListItem from './SalesListItem';
import { Table } from 'semantic-ui-react';

const SalesList = ({ list }) => {
    return (
        <Table celled unstackable compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Sale ID</Table.HeaderCell>
                    <Table.HeaderCell>Date of Sale</Table.HeaderCell>
                    <Table.HeaderCell>Quantity Sold</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {list.map(({ sale_data, card_list, _id }) => (
                    <SalesListItem
                        saleData={sale_data}
                        cardList={card_list}
                        key={_id}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};

export default SalesList;

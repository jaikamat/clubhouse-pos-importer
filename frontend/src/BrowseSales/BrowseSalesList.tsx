import React, { FC } from 'react';
import BrowseSalesItem from './BrowseSalesItem';
import { Table } from 'semantic-ui-react';
import { Sale } from './browseSalesQuery';

interface Props {
    list: Sale[];
}

const BrowseSalesList: FC<Props> = ({ list }) => {
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
                {list.map((sale) => (
                    <BrowseSalesItem sale={sale} />
                ))}
            </Table.Body>
        </Table>
    );
};

export default BrowseSalesList;

import React from 'react';
import { Table, Container } from 'semantic-ui-react';
import InventoryTableRow from './InventoryTableRow';

const InventoryTable = ({ cards }) => {
    const tableInner = cards.map(card => {
        return <InventoryTableRow {...card} />;
    });

    return (
        <Container>
            <Table celled unstackable compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Set</Table.HeaderCell>
                        <Table.HeaderCell>Inventory</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>{tableInner}</Table.Body>
            </Table>
        </Container>
    );
};

export default InventoryTable;

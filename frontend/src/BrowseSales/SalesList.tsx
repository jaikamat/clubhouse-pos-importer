import React, { FC } from 'react';
import SalesListItem from './SalesListItem';
import { Table } from 'semantic-ui-react';
import { FinishCondition } from '../utils/ScryfallCard';

interface SaleData {
    total: string;
    saleID: string;
    timeStamp: string;
    createTime: string;
}

interface SaleCard {
    foil: boolean;
    nonfoil: boolean;
    id: string;
    name: string;
    set: string;
    set_name: string;
    rarity: string;
    reserved: true;
    finishCondition: FinishCondition;
    price: string | number;
    qtyToSell: string | number;
    card_faces: string | number;
}

export interface Sale {
    _id: string;
    sale_data: SaleData;
    card_list: SaleCard[];
}

interface Props {
    list: Sale[];
}

const SalesList: FC<Props> = ({ list }) => {
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
                    <SalesListItem sale={sale} />
                ))}
            </Table.Body>
        </Table>
    );
};

export default SalesList;

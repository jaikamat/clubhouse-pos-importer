import React from 'react';
import SaleLineItem from './SaleLineItem';
import { Table } from 'semantic-ui-react';

const CustomerSaleList = ({ saleList, removeFromSaleList }) => {
    return <Table>
        <Table.Body>
            {saleList.map(card => {
                return <SaleLineItem
                    displayName={card.display_name}
                    {...card}
                    key={`${card.id}${card.finishCondition}${card.qtyToSell}`}
                    deleteLineItem={removeFromSaleList}
                />
            })}
        </Table.Body>
    </Table>

};

export default CustomerSaleList;
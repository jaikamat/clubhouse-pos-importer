import React, { FC } from 'react';
import SaleLineItem from './SaleLineItem';
import { Segment, Header, Icon } from 'semantic-ui-react';
import SalePriceTotal from './SalePriceTotal';
import FinishSale from './FinishSale';
import { SaleListCard } from '../context/SaleContext';

interface Props {
    saleList: SaleListCard[];
}

const CustomerSaleList: FC<Props> = ({ saleList }) => {
    if (saleList.length === 0) {
        return (
            <Segment placeholder>
                <Header icon>
                    <Icon name="plus" />
                    <em>"Give them what they need"</em>
                </Header>
            </Segment>
        );
    }

    return (
        <>
            <Segment.Group>
                {saleList.map((card) => (
                    <SaleLineItem
                        key={`${card.id}${card.finishCondition}${card.qtyToSell}`}
                        card={card}
                    />
                ))}
            </Segment.Group>
            <Segment clearing>
                <Header floated="left">
                    <Header sub>Subtotal</Header>
                    <SalePriceTotal saleList={saleList} />
                </Header>
                <FinishSale />
            </Segment>
        </>
    );
};

export default CustomerSaleList;

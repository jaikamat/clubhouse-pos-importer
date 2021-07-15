import React, { FC } from 'react';
import SaleCartItem from './SaleCartItem';
import { Segment, Header, Icon } from 'semantic-ui-react';
import SaleCartPriceTotal from './SaleCartPriceTotal';
import FinishSale from './FinishSale';
import { SaleListCard } from '../context/SaleContext';

interface Props {
    saleList: SaleListCard[];
}

const SaleCartList: FC<Props> = ({ saleList }) => {
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
                    <SaleCartItem
                        key={`${card.id}${card.finishCondition}${card.qtyToSell}`}
                        card={card}
                    />
                ))}
            </Segment.Group>
            <Segment clearing>
                <Header floated="left">
                    <Header sub>Subtotal</Header>
                    <SaleCartPriceTotal saleList={saleList} />
                </Header>
                <FinishSale />
            </Segment>
        </>
    );
};

export default SaleCartList;

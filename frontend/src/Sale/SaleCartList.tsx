import React, { FC } from 'react';
import SaleCartItem from './SaleCartItem';
import { Segment, Header } from 'semantic-ui-react';
import SaleCartPriceTotal from './SaleCartPriceTotal';
import FinishSale from './FinishSale';
import { SaleListCard } from '../context/SaleContext';
import AddIcon from '@material-ui/icons/Add';
import Placeholder from '../ui/Placeholder';

interface Props {
    saleList: SaleListCard[];
}

const SaleCartList: FC<Props> = ({ saleList }) => {
    if (saleList.length === 0) {
        return (
            <Placeholder icon={<AddIcon style={{ fontSize: 80 }} />}>
                <em>"Give them what they need"</em>
            </Placeholder>
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

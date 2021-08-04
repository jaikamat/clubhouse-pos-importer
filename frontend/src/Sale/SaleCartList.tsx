import React, { FC, Fragment } from 'react';
import SaleCartItem from './SaleCartItem';
import { Segment, Header } from 'semantic-ui-react';
import SaleCartPriceTotal from './SaleCartPriceTotal';
import FinishSale from './FinishSale';
import { SaleListCard } from '../context/SaleContext';
import AddIcon from '@material-ui/icons/Add';
import Placeholder from '../ui/Placeholder';
import { List, Paper, Divider } from '@material-ui/core';

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
            <List component={Paper} variant="outlined">
                {saleList.map((card, idx, arr) => (
                    <Fragment
                        key={`${card.id}${card.finishCondition}${card.qtyToSell}`}
                    >
                        <SaleCartItem card={card} />
                        {idx !== arr.length - 1 && <Divider />}
                    </Fragment>
                ))}
            </List>
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

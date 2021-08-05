import React, { FC, Fragment } from 'react';
import SaleCartItem from './SaleCartItem';
import SaleCartPriceTotal from './SaleCartPriceTotal';
import FinishSale from './FinishSale';
import { SaleListCard } from '../context/SaleContext';
import AddIcon from '@material-ui/icons/Add';
import Placeholder from '../ui/Placeholder';
import { List, Paper, Divider, Box, Grid, Typography } from '@material-ui/core';

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
            <br />
            <Paper variant="outlined">
                <Box p={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography>SUBTOTAL</Typography>
                                <Typography variant="h6">
                                    <b>
                                        <SaleCartPriceTotal
                                            saleList={saleList}
                                        />
                                    </b>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <FinishSale />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
};

export default SaleCartList;

import { Box, Grid, IconButton, ListItem, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { FC } from 'react';
import Chip from '../common/Chip';
import Price from '../common/Price';
import { SaleListCard, useSaleContext } from '../context/SaleContext';
import CardImageTooltip from '../ui/CardImageTooltip';
import SetIcon from '../ui/SetIcon';

interface Props {
    card: SaleListCard;
}

const SaleCartItem: FC<Props> = ({
    card: {
        display_name,
        set,
        finishCondition,
        qtyToSell,
        price,
        rarity,
        id,
        cardImage,
    },
}) => {
    const { removeFromSaleList } = useSaleContext();

    return (
        <ListItem>
            <Grid container alignItems="center" justify="space-between">
                <Grid item>
                    <CardImageTooltip cardImage={cardImage}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6" style={{ cursor: 'help' }}>
                                {display_name}
                            </Typography>
                            <SetIcon set={set} rarity={rarity} />
                            <Chip size="small" label={set.toUpperCase()} />
                        </Box>
                    </CardImageTooltip>
                    <div className="line-item-price">
                        {qtyToSell}x @ <Price num={price} />
                        {' • '}
                        {finishCondition && (
                            <span>
                                {finishCondition.split('_')[1]} {' | '}
                                {finishCondition.split('_')[0]}
                            </span>
                        )}
                    </div>
                </Grid>
                <Grid item>
                    <IconButton
                        onClick={() => removeFromSaleList(id, finishCondition)}
                        color="secondary"
                    >
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default SaleCartItem;

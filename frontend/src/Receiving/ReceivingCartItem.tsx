import { Box, Grid, IconButton, ListItem, Typography } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import React, { FC } from 'react';
import Chip from '../common/Chip';
import Price from '../common/Price';
import {
    ReceivingCard,
    Trade,
    useReceivingContext,
} from '../context/ReceivingContext';
import CardImageTooltip from '../ui/CardImageTooltip';
import SetIcon from '../ui/SetIcon';
import displayFinishCondition from '../utils/displayFinishCondition';

interface Props {
    card: ReceivingCard;
}

// Defines whether it uses cash or credit for trade types
const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

const ReceivingCartItem: FC<Props> = ({ card }) => {
    const {
        display_name,
        set,
        rarity,
        cashPrice,
        creditPrice,
        finishCondition,
        tradeType,
        cardImage,
    } = card;
    const { CASH, CREDIT } = TRADE_TYPE;
    const { removeFromList, activeTradeType } = useReceivingContext();

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
                    <span>{displayFinishCondition(finishCondition)}</span>
                    <div>
                        <span style={{ whiteSpace: 'nowrap' }}>
                            Cash:{' '}
                            <b>
                                <Price num={cashPrice || 0} />
                            </b>
                        </span>
                        {' • '}
                        <span style={{ whiteSpace: 'nowrap' }}>
                            Credit:{' '}
                            <b>
                                <Price num={creditPrice || 0} />
                            </b>
                        </span>
                    </div>
                </Grid>
                <Grid item>
                    <IconButton
                        color={tradeType === CASH ? 'primary' : undefined}
                        onClick={() => activeTradeType(card, Trade.Cash)}
                        disabled={cashPrice === 0}
                    >
                        <AttachMoneyIcon />
                    </IconButton>
                    <IconButton
                        color={tradeType === CREDIT ? 'primary' : undefined}
                        onClick={() => activeTradeType(card, Trade.Credit)}
                        disabled={creditPrice === 0}
                    >
                        <CreditCardIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => removeFromList(card)}
                        color="secondary"
                    >
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default ReceivingCartItem;

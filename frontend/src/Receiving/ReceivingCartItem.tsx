import React, { useContext, FC } from 'react';
import Price from '../common/Price';
import {
    ReceivingCard,
    ReceivingContext,
    Trade,
} from '../context/ReceivingContext';
import SetIcon from '../ui/SetIcon';
import CardImageTooltip from '../ui/CardImageTooltip';
import { ListItem, Grid, Typography, Box, IconButton } from '@material-ui/core';
import Chip from '../common/Chip';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import CloseIcon from '@material-ui/icons/Close';

interface Props {
    card: ReceivingCard;
}

// Defines whether it uses cash or credit for trade types
const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

const ReceivingCartItem: FC<Props> = ({
    card: {
        display_name,
        set,
        rarity,
        cashPrice,
        creditPrice,
        finishCondition,
        uuid_key,
        tradeType,
        cardImage,
    },
}) => {
    const { CASH, CREDIT } = TRADE_TYPE;
    const { removeFromList, activeTradeType } = useContext(ReceivingContext);

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
                    {finishCondition && (
                        <span>
                            {finishCondition.split('_')[1]} {' | '}
                            {finishCondition.split('_')[0]}
                        </span>
                    )}
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
                        onClick={() => activeTradeType(uuid_key, Trade.Cash)}
                        disabled={cashPrice === 0}
                    >
                        <AttachMoneyIcon />
                    </IconButton>
                    <IconButton
                        color={tradeType === CREDIT ? 'primary' : undefined}
                        onClick={() => activeTradeType(uuid_key, Trade.Credit)}
                        disabled={creditPrice === 0}
                    >
                        <CreditCardIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => removeFromList(uuid_key)}
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

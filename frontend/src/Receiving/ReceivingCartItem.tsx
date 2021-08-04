import React, { useState, useContext, FC } from 'react';
import { Button, Label, Icon, Header } from 'semantic-ui-react';
import Price from '../common/Price';
import {
    ReceivingCard,
    ReceivingContext,
    Trade,
} from '../context/ReceivingContext';
import SetIcon from '../ui/SetIcon';
import CardImageTooltip from '../ui/CardImageTooltip';
import { ListItem, Grid } from '@material-ui/core';

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
    const [hovered, setHovered] = useState(false);
    const { removeFromList, activeTradeType } = useContext(ReceivingContext);

    return (
        <ListItem>
            <Grid container alignItems="center" justify="space-between">
                <Grid item>
                    <div>
                        <CardImageTooltip cardImage={cardImage}>
                            <Header as="h4" style={{ cursor: 'help' }}>
                                {display_name}
                            </Header>
                        </CardImageTooltip>
                    </div>
                    <SetIcon set={set} rarity={rarity} />
                    <Label color="grey">{set.toUpperCase()}</Label>
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
                    <Button
                        compact
                        active={tradeType === CASH}
                        color={tradeType === CASH ? 'blue' : undefined}
                        onClick={() => activeTradeType(uuid_key, Trade.Cash)}
                        disabled={cashPrice === 0}
                        icon
                    >
                        <Icon name="dollar sign"></Icon>
                    </Button>
                    <Button
                        compact
                        active={tradeType === CREDIT}
                        color={tradeType === CREDIT ? 'blue' : undefined}
                        onClick={() => activeTradeType(uuid_key, Trade.Credit)}
                        disabled={creditPrice === 0}
                        icon
                    >
                        <Icon name="credit card outline"></Icon>
                    </Button>
                    <Button
                        compact
                        icon="cancel"
                        circular
                        onClick={() => removeFromList(uuid_key)}
                        onMouseOver={() => setHovered(true)}
                        onMouseOut={() => setHovered(false)}
                        color={hovered ? 'red' : undefined}
                    />
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default ReceivingCartItem;

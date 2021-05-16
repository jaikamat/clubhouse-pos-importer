import React, { useState, useContext, FC, MouseEvent } from 'react';
import { Button, Label, Icon, Grid, Segment, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import Price from '../common/Price';
import {
    ReceivingCard,
    ReceivingContext,
    Trade,
} from '../context/ReceivingContext';
import TooltipImage from '../common/TooltipImage';

interface Props {
    card: ReceivingCard;
}

const BoldHelp = styled.b`
    cursor: help;
`;

// Defines whether it uses cash or credit for trade types
const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

const ReceivingListItem: FC<Props> = ({
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
    const [mouseInside, setMouseInside] = useState(false);
    const [mousePos, setMousePos] = useState<{ X?: number }>({});
    const { removeFromList, activeTradeType } = useContext(ReceivingContext);

    const mouseEnter = (e: MouseEvent<HTMLElement>) => {
        const node = e.target as HTMLElement;
        const rect = node.getBoundingClientRect();
        const X = Math.round(e.clientX - rect.x) + 30;
        setMouseInside(true);
        setMousePos({ X });
    };

    const mouseMove = (e: MouseEvent<HTMLElement>) => {
        const node = e.target as HTMLElement;
        const rect = node.getBoundingClientRect();
        const X = Math.round(e.clientX - rect.x) + 30;
        setMousePos({ X });
    };

    const mouseLeave = () => setMouseInside(false);

    return (
        <Segment>
            <Grid verticalAlign="middle">
                <Grid.Column tablet={16} computer={11}>
                    <div>
                        <BoldHelp
                            onMouseEnter={mouseEnter}
                            onMouseMove={mouseMove}
                            onMouseLeave={mouseLeave}
                        >
                            <Header as="h4">{display_name}</Header>
                        </BoldHelp>
                        <span>
                            {mouseInside && (
                                <TooltipImage
                                    image_uri={cardImage}
                                    posX={mousePos.X}
                                />
                            )}
                        </span>
                    </div>
                    <i
                        className={`ss ss-fw ss-${set} ss-${rarity}`}
                        style={{ fontSize: '20px' }}
                    />
                    <Label color="grey">{set.toUpperCase()}</Label>
                    {finishCondition && (
                        <span>
                            {finishCondition.split('_')[1]} {' | '}
                            {finishCondition.split('_')[0]}
                        </span>
                    )}
                    <div></div>
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
                </Grid.Column>
                <Grid.Column tablet={16} computer={5} textAlign="right">
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
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default ReceivingListItem;

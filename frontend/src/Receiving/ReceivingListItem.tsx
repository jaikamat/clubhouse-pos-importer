import React, { useState, useContext, FC, MouseEvent } from 'react';
import { Table, Button, Label, Icon } from 'semantic-ui-react';
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
        <Table.Row>
            <Table.Cell>
                <BoldHelp
                    onMouseEnter={mouseEnter}
                    onMouseMove={mouseMove}
                    onMouseLeave={mouseLeave}
                >
                    {display_name}
                    {mouseInside && (
                        <TooltipImage image_uri={cardImage} posX={mousePos.X} />
                    )}
                </BoldHelp>
            </Table.Cell>
            <Table.Cell singleLine>
                <i
                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                    style={{ fontSize: '20px' }}
                />
                <Label color="grey">{set.toUpperCase()}</Label>
            </Table.Cell>
            <Table.Cell>
                <div style={{ whiteSpace: 'nowrap' }}>
                    Cash{' '}
                    <b>
                        <Price num={cashPrice || 0} />
                    </b>
                </div>
                <div style={{ whiteSpace: 'nowrap' }}>
                    Credit{' '}
                    <b>
                        <Price num={creditPrice || 0} />
                    </b>
                </div>
                {finishCondition && (
                    <p>
                        {finishCondition.split('_')[0]} |{' '}
                        {finishCondition.split('_')[1]}
                    </p>
                )}
            </Table.Cell>
            <Table.Cell>
                <Button
                    active={tradeType === CASH}
                    color={tradeType === CASH ? 'blue' : undefined}
                    onClick={() => activeTradeType(uuid_key, Trade.Cash)}
                    disabled={cashPrice === 0}
                    icon
                >
                    <Icon name="dollar sign"></Icon>
                </Button>
            </Table.Cell>
            <Table.Cell>
                <Button
                    active={tradeType === CREDIT}
                    color={tradeType === CREDIT ? 'blue' : undefined}
                    onClick={() => activeTradeType(uuid_key, Trade.Credit)}
                    disabled={creditPrice === 0}
                    icon
                >
                    <Icon name="credit card outline"></Icon>
                </Button>
            </Table.Cell>
            <Table.Cell>
                <Button
                    icon="cancel"
                    circular
                    onClick={() => removeFromList(uuid_key)}
                    onMouseOver={() => setHovered(true)}
                    onMouseOut={() => setHovered(false)}
                    color={hovered ? 'red' : undefined}
                ></Button>
            </Table.Cell>
        </Table.Row>
    );
};

export default ReceivingListItem;

import React, { useState, useContext } from 'react';
import { Table, Button, Label, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Price from '../common/Price';
import { ReceivingContext } from '../context/ReceivingContext';
import TooltipImage from '../common/TooltipImage';

const BoldHelp = styled.b`
    cursor: help;
`;

// Defines whether it uses cash or credit for trade types
const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

export default function ReceivingListItem({ display_name, set, rarity, cashPrice, creditPrice, finishCondition, uuid_key, tradeType, cardImage }) {
    const { CASH, CREDIT } = TRADE_TYPE;
    const [hovered, setHovered] = useState(false);
    const [mouseInside, setMouseInside] = useState(false);
    const [mousePos, setMousePos] = useState({});
    const { removeFromList, activeTradeType } = useContext(ReceivingContext);

    const mouseEnter = e => {
        const rect = e.target.getBoundingClientRect();
        const X = Math.round(e.clientX - rect.x) + 30;
        setMouseInside(true);
        setMousePos({ X });
    }

    const mouseMove = e => {
        const rect = e.target.getBoundingClientRect();
        const X = Math.round(e.clientX - rect.x) + 30;
        setMousePos({ X });
    }

    const mouseLeave = e => setMouseInside(false);

    return (
        <Table.Row>
            <Table.Cell>
                <BoldHelp
                    onMouseEnter={mouseEnter}
                    onMouseMove={mouseMove}
                    onMouseLeave={mouseLeave}
                >
                    {display_name}
                    {mouseInside && <TooltipImage image_uri={cardImage} posX={mousePos.X} />}
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
                <div style={{ whiteSpace: 'noWrap' }}>
                    Cash <b><Price num={cashPrice} /></b>
                </div>
                <div style={{ whiteSpace: 'noWrap' }}>
                    Credit <b><Price num={creditPrice} /></b>
                </div>
                <p>{finishCondition.split('_')[0]} | {finishCondition.split('_')[1]}</p>
            </Table.Cell>
            <Table.Cell>
                <Button
                    active={tradeType === CASH}
                    color={tradeType === CASH ? 'blue' : null}
                    onClick={() => activeTradeType(uuid_key, CASH)}
                    disabled={cashPrice === 0}
                    icon
                >
                    <Icon name="dollar sign"></Icon>
                </Button>
            </Table.Cell>
            <Table.Cell>
                <Button
                    active={tradeType === CREDIT}
                    color={tradeType === CREDIT ? 'blue' : null}
                    onClick={() => activeTradeType(uuid_key, CREDIT)}
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
                    color={hovered ? 'red' : null}
                >
                </Button>
            </Table.Cell>
        </Table.Row>
    );
}
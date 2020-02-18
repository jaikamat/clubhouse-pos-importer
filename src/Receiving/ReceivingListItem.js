import React, { useState } from 'react';
import { Table, Button, Label, Icon } from 'semantic-ui-react';
import Price from '../Price';

// Defines whether it uses cash or credit for trade types
const TRADE_TYPE = { CASH: 'CASH', CREDIT: 'CREDIT' };

export default function ReceivingListItem({ name, set, rarity, cashPrice, creditPrice, finishCondition, uuid_key, removeFromList, tradeType, activeTradeType }) {
    const { CASH, CREDIT } = TRADE_TYPE;
    const [hovered, setHovered] = useState(false);

    return (
        <Table.Row>
            <Table.Cell><b>{name}</b></Table.Cell>
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
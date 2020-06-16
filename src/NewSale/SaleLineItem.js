import React, { useState, useContext } from 'react';
import { Button, Label, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { SaleContext } from '../context/SaleContext';
import Price from '../common/Price';
import TooltipImage from '../common/TooltipImage';

const BoldHelp = styled.b`
    cursor: help;
`;

export default function SaleLineItem({ display_name, set, finishCondition, qtyToSell, price, rarity, id, cardImage }) {
    const [hovered, setHovered] = useState(false);
    const [mouseInside, setMouseInside] = useState(false);
    const [mousePos, setMousePos] = useState({});
    const { removeFromSaleList } = useContext(SaleContext);

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
            <Table.Cell><h4 classname="line-item-title">
                <BoldHelp
                    onMouseEnter={mouseEnter}
                    onMouseMove={mouseMove}
                    onMouseLeave={mouseLeave}
                >
                    {display_name}
                    {mouseInside && <TooltipImage image_uri={cardImage} posX={mousePos.X} />}
                </BoldHelp>
            </h4></Table.Cell>
            <Table.Cell singleLine>
                <i
                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                    style={{ fontSize: '20px' }}
                />
                <Label color="grey">{set.toUpperCase()}</Label>
            </Table.Cell>
            <Table.Cell>
                <div className="line-item-price">
                    {qtyToSell}x @ <Price num={price} /> | {finishCondition}
                </div>
            </Table.Cell>
            <Table.Cell>
                <Button
                    icon="cancel"
                    circular
                    onClick={() => removeFromSaleList(id, finishCondition)}
                    onMouseOver={() => setHovered(true)}
                    onMouseOut={() => setHovered(false)}
                    color={hovered ? 'red' : null}
                >
                </Button>
            </Table.Cell>
        </Table.Row>
    );
}

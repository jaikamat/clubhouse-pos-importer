import React, { useState, useContext, FC, MouseEvent } from 'react';
import { Button, Label, Table } from 'semantic-ui-react';
import styled from 'styled-components';
import { SaleContext, SaleListCard } from '../context/SaleContext';
import Price from '../common/Price';
import TooltipImage from '../common/TooltipImage';

interface Props {
    card: SaleListCard;
}

const BoldHelp = styled.b`
    cursor: help;
`;

const SaleLineItem: FC<Props> = ({
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
    const [hovered, setHovered] = useState(false);
    const [mouseInside, setMouseInside] = useState<boolean>(false);
    const [mousePos, setMousePos] = useState<{ X?: number }>({});
    const { removeFromSaleList } = useContext(SaleContext);

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

    const mouseLeave = (e: MouseEvent) => setMouseInside(false);

    return (
        <Table.Row>
            <Table.Cell>
                <h4 className="line-item-title">
                    <BoldHelp
                        onMouseEnter={mouseEnter}
                        onMouseMove={mouseMove}
                        onMouseLeave={mouseLeave}
                    >
                        {display_name}
                        {mouseInside && (
                            <TooltipImage
                                image_uri={cardImage}
                                posX={mousePos.X}
                            />
                        )}
                    </BoldHelp>
                </h4>
            </Table.Cell>
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
                    // TODO: remove inline styles
                    style={{
                        backgroundColor: hovered ? 'red' : null,
                        color: hovered ? 'white' : null,
                    }}
                ></Button>
            </Table.Cell>
        </Table.Row>
    );
};

export default SaleLineItem;

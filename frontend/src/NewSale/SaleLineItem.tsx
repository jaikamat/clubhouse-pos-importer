import React, { useState, useContext, FC, MouseEvent } from 'react';
import { Button, Grid, Header, Label, Segment } from 'semantic-ui-react';
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
                </Grid.Column>
                <Grid.Column tablet={16} computer={5} textAlign="right">
                    <Button
                        compact
                        icon="cancel"
                        circular
                        onClick={() => removeFromSaleList(id, finishCondition)}
                        onMouseOver={() => setHovered(true)}
                        onMouseOut={() => setHovered(false)}
                        color={hovered ? 'red' : undefined}
                    />
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default SaleLineItem;

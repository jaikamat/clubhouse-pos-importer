import React, { useState, useContext, FC } from 'react';
import { Button, Grid, Header, Label, Segment } from 'semantic-ui-react';
import { SaleContext, SaleListCard } from '../context/SaleContext';
import Price from '../common/Price';
import SetIcon from '../ui/SetIcon';
import CardImageTooltip from '../ui/CardImageTooltip';

interface Props {
    card: SaleListCard;
}

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
    const { removeFromSaleList } = useContext(SaleContext);

    return (
        <Segment>
            <Grid verticalAlign="middle">
                <Grid.Column tablet={16} computer={11}>
                    <div>
                        <CardImageTooltip cardImage={cardImage}>
                            <Header as="h4" style={{ cursor: 'help' }}>
                                {display_name}
                            </Header>
                        </CardImageTooltip>
                    </div>
                    <SetIcon set={set} rarity={rarity} />
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

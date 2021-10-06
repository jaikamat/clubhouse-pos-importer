import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import CardImage from '../common/CardImage';
import MarketPrice from '../common/MarketPrice';
import InventoryChip from '../ui/InventoryChip';
import { ClientCard } from '../utils/ClientCard';
import parseQoh from '../utils/parseQoh';

interface Props {
    card: ClientCard;
}

// These numbers were the originally calculated px values
const cardImageRatio = 418.3 / 300;
const cardImageWidth = 275;
const cardImageHeight = cardImageRatio * cardImageWidth;

const useStyles = makeStyles(() => ({
    imageWrapper: {
        width: `${cardImageWidth}px`,
        height: `${cardImageHeight}px`,
        boxShadow: `2px 2px 5px 0 rgba(0, 0, 0, 0.25)`,
        background: `repeating-linear-gradient(
            45deg,
            #bfbfbf,
            #bfbfbf 10px,
            #b0b0b0 10px,
            #b0b0b0 20px
        )`,
        borderRadius: `15px`,
        '& > img': {
            borderRadius: '15px',
        },
    },
    inventoryRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '5px',
    },
    inventoryWrapper: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: ' 5px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '10px 10px 10px 10px',
        boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.25)',
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: `${cardImageWidth}px`,
    },
}));

const PublicCard: FC<Props> = ({ card }) => {
    const { imageWrapper, inventoryRow, inventoryWrapper, wrapper } =
        useStyles();
    const { id, cardImage } = card;
    const [foilQty, nonfoilQty, etchedQty] = parseQoh(card.qoh);

    return (
        <div className={wrapper}>
            <div className={imageWrapper}>
                <CardImage source={cardImage} width={cardImageWidth} />
            </div>
            <div className={inventoryWrapper}>
                {foilQty > 0 && (
                    <div className={inventoryRow}>
                        <InventoryChip quantity={foilQty} label="Foil" />
                        <MarketPrice
                            id={id}
                            finish="FOIL"
                            round
                            showMid={false}
                        />
                    </div>
                )}
                {nonfoilQty > 0 && (
                    <div className={inventoryRow}>
                        <InventoryChip quantity={nonfoilQty} label="Nonfoil" />
                        <MarketPrice
                            id={id}
                            finish="NONFOIL"
                            round
                            showMid={false}
                        />
                    </div>
                )}
                {etchedQty > 0 && (
                    <div className={inventoryRow}>
                        <InventoryChip quantity={etchedQty} label="Etched" />
                        <MarketPrice
                            id={id}
                            finish="ETCHED"
                            round
                            showMid={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicCard;

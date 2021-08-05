import { TableCell, TableRow } from '@material-ui/core';
import React, { FC } from 'react';
import Price from '../common/Price';
import CardImageTooltip from '../ui/CardImageTooltip';
import SetIcon from '../ui/SetIcon';
import { ResponseCard } from './filteredCardsQuery';
import StarIcon from '@material-ui/icons/Star';

const conditionMap = {
    NM: 'Near Mint',
    LP: 'Light Play',
    MP: 'Moderate Play',
    HP: 'Heavy Play',
};

type Condition = keyof typeof conditionMap;

interface Props {
    card: ResponseCard;
}

const BrowseInventoryRow: FC<Props> = ({
    card: {
        finishCondition,
        quantityInStock,
        name,
        set_name,
        price,
        set,
        rarity,
        image_uri,
    },
}) => {
    const finish = finishCondition.split('_')[0];
    const condition = finishCondition.split('_')[1] as Condition;

    return (
        <TableRow>
            <TableCell>
                <CardImageTooltip cardImage={image_uri}>
                    <span style={{ cursor: 'help' }}>{name} </span>
                </CardImageTooltip>
                {finish === 'FOIL' && (
                    // TODO: Pull out this inline styling into a custom component
                    <StarIcon
                        fontSize="small"
                        color="primary"
                        style={{ verticalAlign: 'middle' }}
                    />
                )}
            </TableCell>
            <TableCell>
                <SetIcon set={set} rarity={rarity} />
                {set_name}
            </TableCell>
            <TableCell>{conditionMap[condition]}</TableCell>
            <TableCell>{quantityInStock}</TableCell>
            <TableCell>
                <Price num={price} />
            </TableCell>
        </TableRow>
    );
};

export default BrowseInventoryRow;

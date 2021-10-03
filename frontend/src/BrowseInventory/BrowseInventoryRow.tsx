import { TableCell, TableRow } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import React, { FC } from 'react';
import Price from '../common/Price';
import CardImageTooltip from '../ui/CardImageTooltip';
import SetIcon from '../ui/SetIcon';
import { Finish } from '../utils/ClientCard';
import displayFinishCondition from '../utils/finishCondition';
import { ResponseCard } from './filteredCardsQuery';

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
    const finish = finishCondition.split('_')[0] as Finish;

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
            <TableCell>{displayFinishCondition(finishCondition)}</TableCell>
            <TableCell>{quantityInStock}</TableCell>
            <TableCell>
                <Price num={price} />
            </TableCell>
        </TableRow>
    );
};

export default BrowseInventoryRow;

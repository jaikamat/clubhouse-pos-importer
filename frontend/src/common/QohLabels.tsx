import { Tooltip, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import InventoryChip from '../ui/InventoryChip';
import { QOH } from '../utils/ClientCard';
import displayFinishCondition from '../utils/displayFinishCondition';
import parseQoh from '../utils/parseQoh';

export const createInventoryLineItems = (
    inventoryQty: QOH,
    matchStrings: (keyof QOH)[]
): string[] => {
    const matches = matchStrings
        .map((finishCondition) => {
            const quantity = inventoryQty[finishCondition];
            if (quantity && quantity > 0) {
                return `${displayFinishCondition(
                    finishCondition
                )}: ${quantity}`;
            } else {
                return null;
            }
        })
        .filter((m): m is string => !!m);

    if (matches.length === 0) return ['None in stock'];
    return matches;
};

interface Props {
    inventoryQty: QOH;
}

interface LabelWithPopupProps {
    quantity: number;
    label: string;
    popupLineItems: string[];
}

const LabelWithPopup: FC<LabelWithPopupProps> = ({
    quantity,
    label,
    popupLineItems,
}) => (
    <Tooltip
        title={popupLineItems.map((item) => (
            <Typography key={Math.random()} variant="body2">
                {item}
            </Typography>
        ))}
        arrow
        placement="top"
    >
        <InventoryChip quantity={quantity} label={label} />
    </Tooltip>
);

// This component parses the `qoh` object from mongo into something more presentable
const QohLabels: FC<Props> = ({ inventoryQty }) => {
    const [foilQuantity, nonfoilQuantity, etchedQuantity] =
        parseQoh(inventoryQty);

    const foilLineItems = createInventoryLineItems(inventoryQty, [
        'FOIL_NM',
        'FOIL_LP',
        'FOIL_MP',
        'FOIL_HP',
    ]);

    const nonfoilLineItems = createInventoryLineItems(inventoryQty, [
        'NONFOIL_NM',
        'NONFOIL_LP',
        'NONFOIL_MP',
        'NONFOIL_HP',
    ]);

    const etchedLineItems = createInventoryLineItems(inventoryQty, [
        'ETCHED_NM',
        'ETCHED_LP',
        'ETCHED_MP',
        'ETCHED_HP',
    ]);

    return (
        <>
            <LabelWithPopup
                label="Foil"
                quantity={foilQuantity}
                popupLineItems={foilLineItems}
            />
            <LabelWithPopup
                label="Nonfoil"
                quantity={nonfoilQuantity}
                popupLineItems={nonfoilLineItems}
            />
            {etchedQuantity > 0 && (
                <LabelWithPopup
                    label="Etched"
                    quantity={etchedQuantity}
                    popupLineItems={etchedLineItems}
                />
            )}
        </>
    );
};

export default QohLabels;

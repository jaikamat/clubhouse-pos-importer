import React, { FC } from 'react';
import { Popup } from 'semantic-ui-react';
import InventoryChip from '../ui/InventoryChip';
import displayFinishCondition from '../utils/finishCondition';
import parseQoh from '../utils/parseQoh';
import { QOH } from '../utils/ScryfallCard';

export const createInventoryLineItems = (
    inventoryQty: Partial<QOH>,
    matchStrings: (keyof QOH)[]
): string[] => {
    const matches = matchStrings
        .map((finishCondition) => {
            const quantity = inventoryQty[finishCondition];
            if (quantity && quantity > 0)
                return `${displayFinishCondition(
                    finishCondition
                )}: ${quantity}`;
        })
        .filter((m): m is string => !!m);

    if (matches.length === 0) return ['None in stock'];
    return matches;
};

interface Props {
    inventoryQty: Partial<QOH>;
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
    <Popup
        content={popupLineItems.map((msg) => (
            <div>{msg}</div>
        ))}
        trigger={<InventoryChip quantity={quantity} label={label} />}
    />
);

// This component parses the `qoh` object from mongo into something more presentable
const QohLabels: FC<Props> = ({ inventoryQty }) => {
    const [foilQuantity, nonfoilQuantity] = parseQoh(inventoryQty);

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
        </>
    );
};

export default QohLabels;

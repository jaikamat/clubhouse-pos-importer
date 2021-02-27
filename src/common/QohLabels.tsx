import React, { FC } from 'react';
import { Label, Popup } from 'semantic-ui-react';
import parseQoh from '../utils/parseQoh';
import { QOH } from '../utils/ScryfallCard';

type FinishConditionLabels = Record<keyof QOH, string>;

const prettyLabel = (finishCondition: keyof QOH) => {
    const finishConditionLabels: FinishConditionLabels = {
        FOIL_NM: 'Foil (NM)',
        FOIL_LP: 'Foil (LP)',
        FOIL_MP: 'Foil (MP)',
        FOIL_HP: 'Foil (HP)',
        NONFOIL_NM: 'Nonfoil (NM)',
        NONFOIL_LP: 'Nonfoil (LP)',
        NONFOIL_MP: 'Nonfoil (MP)',
        NONFOIL_HP: 'Nonfoil (HP)',
    };

    return finishConditionLabels[finishCondition];
};

const createInventoryLineItems = (
    inventoryQty: Partial<QOH>,
    matchStrings: (keyof QOH)[]
): string[] => {
    const matches = matchStrings
        .map((finishCondition) => {
            const quantity = inventoryQty[finishCondition];
            if (quantity && quantity > 0)
                return `${prettyLabel(finishCondition)}: ${quantity}`;
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
        trigger={
            <Label color={quantity > 0 ? 'blue' : undefined} image>
                {label}
                <Label.Detail>{quantity}</Label.Detail>
            </Label>
        }
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

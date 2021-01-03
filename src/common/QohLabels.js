import React from 'react';
import { Label, Popup } from 'semantic-ui-react';
import parseQoh from '../utils/parseQoh';

// This component parses the `qoh` object from mongo into something
// more presentable

// available entries:
// {
//     FOIL_NM: 0,
//     FOIL_LP: 0,
//     FOIL_MP: 0,
//     FOIL_HP: 0,
//     NONFOIL_NM: 0,
//     NONFOIL_LP: 0,
//     NONFOIL_MP: 0,
//     NONFOIL_HP: 0
// };

/**
 * Maps a database label to a pretty display version of the label for display
 */
const prettyLabel = (finishCondition) => {
    const labelMap = {
        FOIL_NM: 'Foil (NM)',
        FOIL_LP: 'Foil (LP)',
        FOIL_MP: 'Foil (MP)',
        FOIL_HP: 'Foil (HP)',
        NONFOIL_NM: 'Nonfoil (NM)',
        NONFOIL_LP: 'Nonfoil (LP)',
        NONFOIL_MP: 'Nonfoil (MP)',
        NONFOIL_HP: 'Nonfoil (HP)',
    };

    return labelMap[finishCondition] ? labelMap[finishCondition] : 'Not found';
};

/**
 * Takes in inventoryQty and a list of strings to match. If the strings are in the list,
 * they will render
 *
 * @param {object} inventoryQty
 * @param {object} matchStrings
 */
const showInventory = (inventoryQty, matchStrings) => {
    return Object.entries(inventoryQty).map(([k, v]) => {
        if (matchStrings.includes(k) && v > 0) {
            return (
                <p>
                    {prettyLabel(k)}: {v}
                </p>
            );
        }
    });
};

export default function QohLabels({ inventoryQty }) {
    const [foilQty, nonfoilQty] = parseQoh(inventoryQty);

    return (
        <>
            <Popup
                content={
                    foilQty > 0
                        ? showInventory(inventoryQty, [
                              'FOIL_NM',
                              'FOIL_LP',
                              'FOIL_MP',
                              'FOIL_HP',
                          ])
                        : 'None in stock'
                }
                trigger={
                    <Label
                        color={foilQty > 0 ? 'blue' : 'transparent'}
                        image
                        className="foil-label"
                    >
                        Foil
                        <Label.Detail className="foil-label-qty">
                            {foilQty}
                        </Label.Detail>
                    </Label>
                }
            />
            <Popup
                content={
                    nonfoilQty > 0
                        ? showInventory(inventoryQty, [
                              'NONFOIL_NM',
                              'NONFOIL_LP',
                              'NONFOIL_MP',
                              'NONFOIL_HP',
                          ])
                        : 'None in stock'
                }
                trigger={
                    <Label
                        color={nonfoilQty > 0 ? 'blue' : 'transparent'}
                        image
                        className="nonfoil-label"
                    >
                        Nonfoil
                        <Label.Detail className="nonfoil-label-qty">
                            {nonfoilQty}
                        </Label.Detail>
                    </Label>
                }
            />
        </>
    );
}

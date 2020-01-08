import React from 'react';
import { Label } from 'semantic-ui-react';

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

export default function QohParser({ inventoryQty }) {
    let foilQty = 0;
    let nonfoilQty = 0;

    if (inventoryQty) { // Check to see if props exist
        foilQty =
            (inventoryQty.FOIL_NM || 0) +
            (inventoryQty.FOIL_LP || 0) +
            (inventoryQty.FOIL_MP || 0) +
            (inventoryQty.FOIL_HP || 0);

        nonfoilQty =
            (inventoryQty.NONFOIL_NM || 0) +
            (inventoryQty.NONFOIL_LP || 0) +
            (inventoryQty.NONFOIL_MP || 0) +
            (inventoryQty.NONFOIL_HP || 0);
    }

    return (
        <React.Fragment>
            <Label color={foilQty ? 'blue' : 'gray'} image>
                Foil
        <Label.Detail>{foilQty}</Label.Detail>
            </Label>
            <Label color={nonfoilQty ? 'blue' : 'gray'} image>
                Nonfoil
        <Label.Detail>{nonfoilQty}</Label.Detail>
            </Label>
        </React.Fragment>
    );
}

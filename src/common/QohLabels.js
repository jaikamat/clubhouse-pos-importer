import React from 'react';
import { Label } from 'semantic-ui-react';
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

export default function QohLabels({ inventoryQty }) {
    const [foilQty, nonfoilQty] = parseQoh(inventoryQty);

    const foilColor = {};
    if (foilQty > 0) { foilColor.color = 'blue'; }

    const nonfoilColor = {};
    if (nonfoilQty > 0) { nonfoilColor.color = 'blue'; }

    return (
        <React.Fragment>
            <Label {...foilColor} image>
                Foil
        <Label.Detail>{foilQty}</Label.Detail>
            </Label>
            <Label {...nonfoilColor} image>
                Nonfoil
        <Label.Detail>{nonfoilQty}</Label.Detail>
            </Label>
        </React.Fragment>
    );
}

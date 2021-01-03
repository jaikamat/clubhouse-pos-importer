import React from 'react';
import { Label } from 'semantic-ui-react';

export default function SearchMetadata({ searchResults }) {
    const foilQuantity = searchResults
        .map((c) => c.qohParsed[0])
        .reduce((acc, c) => acc + c, 0);
    const nonfoilQuantity = searchResults
        .map((c) => c.qohParsed[1])
        .reduce((acc, c) => acc + c, 0);

    return (
        <div>
            Totals on hand: {''}
            <Label color={nonfoilQuantity > 0 ? 'blue' : 'transparent'} image>
                Nonfoil<Label.Detail>{nonfoilQuantity}</Label.Detail>
            </Label>
            <Label color={foilQuantity > 0 ? 'blue' : 'transparent'} image>
                Foil<Label.Detail>{foilQuantity}</Label.Detail>
            </Label>
        </div>
    );
}

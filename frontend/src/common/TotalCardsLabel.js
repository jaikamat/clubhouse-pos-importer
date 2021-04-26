import React from 'react';
import { Label } from 'semantic-ui-react';

export default function TotalCardsLabel({ listLength }) {
    const displayStr = listLength > 1 ? 'cards' : 'card';

    if (listLength > 0) {
        return <Label color='grey'>{listLength} {displayStr}</Label>
    }

    return null;
}

/**
 * Cards in the Sale List need to be looped and counted
 * Receiving's list is one per line, so it's more straightforward there
 *
 * @param {Array} saleListCards - The Sale List cards
 */
export function findSaleCardsQty(saleListCards) {
    return saleListCards.reduce((acc, curr) => acc + curr.qtyToSell, 0);
}
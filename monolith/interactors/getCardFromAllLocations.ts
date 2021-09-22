import parseQoh from '../lib/parseQoh';
import getCardsWithInfo from './getCardsWithInfo';

/**
 * The initial accumulator
 */
const initialFinishes = { foilQty: 0, nonfoilQty: 0, etchedQty: 0 };

/**
 * The callback for `reduce`. Extracted for sharing
 */
const accumulateFinishes = (acc: typeof initialFinishes, c) => {
    const { foilQty, nonfoilQty, etchedQty } = parseQoh(c.qoh);
    return {
        foilQty: acc.foilQty + foilQty,
        nonfoilQty: acc.nonfoilQty + nonfoilQty,
        etchedQty: acc.etchedQty + etchedQty,
    };
};

async function getCardFromAllLocations(title: string) {
    try {
        const ch1 = await getCardsWithInfo(title, true, 'ch1');
        const ch2 = await getCardsWithInfo(title, true, 'ch2');

        // Add up the finish quantities of each card's QOH
        const ch1Combined = ch1.reduce(accumulateFinishes, initialFinishes);
        const ch2Combined = ch2.reduce(accumulateFinishes, initialFinishes);

        return {
            ch1: ch1Combined,
            ch2: ch2Combined,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default getCardFromAllLocations;

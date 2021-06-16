import parseQoh from '../lib/parseQoh';
import getCardsWithInfo from './getCardsWithInfo';

async function getCardFromAllLocations(title: string) {
    try {
        const ch1 = await getCardsWithInfo(title, true, 'ch1');
        const ch2 = await getCardsWithInfo(title, true, 'ch2');

        // Add up the [foil, nonfoil] quantities of each card's QOH
        const ch1Combined = ch1.reduce(
            (acc, c) => {
                const { foilQty, nonfoilQty } = parseQoh(c.qoh);
                return {
                    foilQty: acc.foilQty + foilQty,
                    nonfoilQty: acc.nonfoilQty + nonfoilQty,
                };
            },
            { foilQty: 0, nonfoilQty: 0 }
        );

        const ch2Combined = ch2.reduce(
            (acc, c) => {
                const { foilQty, nonfoilQty } = parseQoh(c.qoh);
                return {
                    foilQty: acc.foilQty + foilQty,
                    nonfoilQty: acc.nonfoilQty + nonfoilQty,
                };
            },
            { foilQty: 0, nonfoilQty: 0 }
        );

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

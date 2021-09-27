import mockData from './mockData';
import { ScryfallCard } from './ScryfallCard';
import sortSaleList from './sortSaleList';

/**
 * Shuffles an array
 * @param {array} arr - The array to randomize
 */
function randomizeArray(arr: any[]) {
    const output = [];

    // Picks a random index from the source array, splices and them pushes it to output
    while (arr.length) {
        const randomCard = arr.splice(
            Math.floor(Math.random() * arr.length),
            1
        );
        output.push(randomCard[0]);
    }

    return output.map((c) => new ScryfallCard(c));
}

describe('Sort function', () => {
    test('Sorts the sample data', () => {
        const random = randomizeArray(mockData);
        const sorted = sortSaleList(random);

        expect(sorted.map((s) => s.name)).toMatchInlineSnapshot(`
            Array [
              "Archangel Avacyn // Avacyn, the Purifier",
              "Bazaar Trademage",
              "Necropotence",
              "Wheel of Fortune",
              "Colossal Dreadmaw",
              "Curious Pair // Treats to Share",
              "World Breaker",
              "Sigarda, Host of Herons",
              "Dimir Keyrune",
              "Emrakul, the Aeons Torn",
              "Gaea's Cradle",
            ]
        `);
    });
});

import sortSaleList from '../utils/sortSaleList';
import mockData from './data/sorting_mockData';

/**
 * Shuffles an array
 * @param {array} arr - The array to ramdomize
 */
function randomizeArray(arr) {
    const output = [];

    // Picks a random index from the source array, splices and them pushes it to output
    while (arr.length) {
        const randomCard = arr.splice(Math.floor(Math.random() * arr.length), 1);
        output.push(randomCard[0]);
    }

    return output
}

describe('Sort function', () => {
    test('Sorts the sammple data properly', () => {
        const random = randomizeArray(mockData);
        const sorted = sortSaleList(random);

        expect(sorted[0].name).toBe('Archangel Avacyn // Avacyn, the Purifier');
        expect(sorted[1].name).toBe('Bazaar Trademage');
        expect(sorted[2].name).toBe('Necropotence');
        expect(sorted[3].name).toBe('Wheel of Fortune');
        expect(sorted[4].name).toBe('Colossal Dreadmaw');
        expect(sorted[5].name).toBe('Sigarda, Host of Herons');
        expect(sorted[6].name).toBe('Emrakul, the Aeons Torn');
        expect(sorted[7].name).toBe('Gaea\'s Cradle');
    })
})
import parseQoh from '../utils/parseQoh';

const input = {
    FOIL_NM: 1,
    FOIL_LP: 0,
    FOIL_MP: 2,
    FOIL_HP: 0,
    NONFOIL_NM: 3,
    NONFOIL_LP: 0,
    NONFOIL_MP: 11,
    NONFOIL_HP: 0
};

describe('Testing QOH Parser', () => {
    test('Outputs the correct foil/nonfoil values', () => {
        const [foilQty, nonfoilQty] = parseQoh(input);

        expect(foilQty).toEqual(3);
        expect(nonfoilQty).toEqual(14);
    })
});
import parseQoh from './parseQoh';
import { QOH } from './ScryfallCard';

test('Parse QOH', () => {
    const mock: QOH = {
        FOIL_HP: 3,
        FOIL_LP: 2,
        NONFOIL_HP: 4,
        NONFOIL_NM: 7,
    };

    expect(parseQoh(mock)).toMatchInlineSnapshot(`
        Array [
          5,
          11,
        ]
    `);
});

test('Parse full QOH', () => {
    const input = {
        FOIL_NM: 1,
        FOIL_LP: 0,
        FOIL_MP: 2,
        FOIL_HP: 0,
        NONFOIL_NM: 3,
        NONFOIL_LP: 0,
        NONFOIL_MP: 11,
        NONFOIL_HP: 0,
    };

    const [foilQty, nonfoilQty] = parseQoh(input);

    expect(foilQty).toEqual(3);
    expect(nonfoilQty).toEqual(14);
});

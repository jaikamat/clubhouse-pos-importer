import parseQoh from './parseQoh';
import { QOH } from './ScryfallCard';

test('Parse QOH', () => {
    const mock: Partial<QOH> = {
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

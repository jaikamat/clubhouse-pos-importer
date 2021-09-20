import createDisplayName from './createDisplayName';

test('create display name', () => {
    expect(
        createDisplayName({
            name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['normal'],
            border_color: 'black',
            lang: 'en',
            finishes: ['foil', 'nonfoil'],
        })
    ).toMatchInlineSnapshot(`"Card, the Name"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['normal'],
            border_color: 'black',
            lang: 'ja',
            finishes: ['foil'],
        })
    ).toMatchInlineSnapshot(`"Card, the Name (JA)"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            promo_types: ['godzillaseries'],
            frame_effects: ['normal'],
            border_color: 'black',
            lang: 'en',
            finishes: ['foil', 'nonfoil'],
        })
    ).toMatchInlineSnapshot(`"Card, the Name (IP series)"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['showcase'],
            border_color: 'black',
            lang: 'en',
            finishes: ['foil', 'nonfoil'],
        })
    ).toMatchInlineSnapshot(`"Card, the Name (Showcase)"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['extendedart'],
            border_color: 'black',
            lang: 'en',
            finishes: ['foil', 'nonfoil'],
        })
    ).toMatchInlineSnapshot(`"Card, the Name (Extended art)"`);
});

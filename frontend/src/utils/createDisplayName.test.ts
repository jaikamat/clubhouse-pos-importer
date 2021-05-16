import createDisplayName from './createDisplayName';

test('create display name', () => {
    expect(
        createDisplayName({
            name: 'Card, the Name',
            printed_name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['normal'],
            border_color: 'black',
            lang: 'en',
            set: 'abc',
            foil: true,
            nonfoil: true,
        })
    ).toMatchInlineSnapshot(`"Card, the Name"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            printed_name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['normal'],
            border_color: 'black',
            lang: 'ja',
            set: 'sta',
            foil: true,
            nonfoil: false,
        })
    ).toMatchInlineSnapshot(`"Card, the Name (Etched foil) (JA)"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            promo_types: ['godzillaseries'],
            printed_name: null,
            frame_effects: ['normal'],
            border_color: 'black',
            lang: 'en',
            set: 'abc',
            foil: true,
            nonfoil: true,
        })
    ).toMatchInlineSnapshot(`"Card, the Name (IP series)"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            printed_name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['showcase'],
            border_color: 'black',
            lang: 'en',
            set: 'abc',
            foil: true,
            nonfoil: true,
        })
    ).toMatchInlineSnapshot(`"Card, the Name (Showcase)"`);

    expect(
        createDisplayName({
            name: 'Card, the Name',
            printed_name: 'Card, the Name',
            promo_types: [],
            frame_effects: ['extendedart'],
            border_color: 'black',
            lang: 'en',
            set: 'abc',
            foil: true,
            nonfoil: true,
        })
    ).toMatchInlineSnapshot(`"Card, the Name (Extended art)"`);
});

import {
    createDropdownFinishOptions,
    finishDropdownDisabled,
} from './dropdownOptions';

test('Creates accurate dropdowns', () => {
    expect(createDropdownFinishOptions(['etched', 'foil', 'nonfoil']))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "NONFOIL",
            "text": "Nonfoil",
            "value": "NONFOIL",
          },
          Object {
            "key": "FOIL",
            "text": "Foil",
            "value": "FOIL",
          },
          Object {
            "key": "ETCHED",
            "text": "Etched",
            "value": "ETCHED",
          },
        ]
    `);
});

test('Creates dropdowns in same order', () => {
    const optionsA = createDropdownFinishOptions(['etched', 'foil', 'nonfoil']);
    const optionsB = createDropdownFinishOptions(['nonfoil', 'foil', 'etched']);

    expect(JSON.stringify(optionsA)).toEqual(JSON.stringify(optionsB));
});

test('Reports finish disabled on certain arrays', () => {
    expect(finishDropdownDisabled(['nonfoil'])).toBe(true);
    expect(finishDropdownDisabled(['nonfoil', 'foil'])).toBe(false);
});

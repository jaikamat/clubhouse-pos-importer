import checkCardFinish from './checkCardFinish';

test('assertion', () => {
    expect(checkCardFinish(['nonfoil'])).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": true,
          "selectedFinish": "NONFOIL",
        }
    `);
    expect(checkCardFinish(['nonfoil', 'foil'])).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": false,
          "selectedFinish": "NONFOIL",
        }
    `);
    expect(checkCardFinish(['foil'])).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": true,
          "selectedFinish": "FOIL",
        }
    `);
    expect(checkCardFinish(['nonfoil', 'foil'])).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": false,
          "selectedFinish": "NONFOIL",
        }
    `);
});

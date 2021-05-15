import checkCardFinish from './checkCardFinish';

test('assertion', () => {
    expect(checkCardFinish(true, false)).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": true,
          "selectedFinish": "NONFOIL",
        }
    `);
    expect(checkCardFinish(true, true)).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": false,
          "selectedFinish": "NONFOIL",
        }
    `);
    expect(checkCardFinish(false, true)).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": true,
          "selectedFinish": "FOIL",
        }
    `);
    expect(checkCardFinish(false, false)).toMatchInlineSnapshot(`
        Object {
          "finishDisabled": false,
          "selectedFinish": "NONFOIL",
        }
    `);
});

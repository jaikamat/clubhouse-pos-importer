import { render, screen } from '@testing-library/react';
import QohLabels, { createInventoryLineItems } from './QohLabels';

test('createInventoryLineItems', () => {
    const mockQoh = {
        FOIL_NM: 33,
        NONFOIL_HP: 7,
        NONFOIL_LP: 12,
    };

    expect(createInventoryLineItems(mockQoh, ['FOIL_NM']))
        .toMatchInlineSnapshot(`
        Array [
          "Foil (NM): 33",
        ]
    `);

    // Elements that do or do not exist in the source
    expect(
        createInventoryLineItems(mockQoh, [
            'FOIL_NM',
            'NONFOIL_HP',
            'NONFOIL_MP',
        ])
    ).toMatchInlineSnapshot(`
        Array [
          "Foil (NM): 33",
          "Nonfoil (HP): 7",
        ]
    `);

    // Elements that do not exist in the source
    expect(createInventoryLineItems(mockQoh, ['FOIL_HP']))
        .toMatchInlineSnapshot(`
        Array [
          "None in stock",
        ]
    `);
});

test('QOH label', () => {
    render(
        <QohLabels
            inventoryQty={{
                FOIL_NM: 33,
                NONFOIL_HP: 7,
                NONFOIL_LP: 12,
            }}
        />
    );

    screen.getByText('Foil');
    screen.getByText('33');

    screen.getByText('Nonfoil');
    screen.getByText('19');
});

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { QOH } from '../utils/ClientCard';
import currentButton from '../utils/testing/currentButton';
import currentByLabelText from '../utils/testing/currentByLabelText';
import dropdownOptionClick from '../utils/testing/dropdownOptionClick';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import mockHttp from '../utils/testing/mockHttp';
import selectDropdownByValue from '../utils/testing/selectDropdownByValue';
import SaleSearchCard from './SaleSearchCard';

const data = {
    marketPrices: { foil: 11.2, normal: 4.56 },
    medianPrices: { foil: 12.78, normal: 5.1 },
};

jest.mock('axios', () => mockHttp(data));

test('list item title and metadata', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    await screen.findByText('Seventh Edition (7ED) - English');
});

test('list item prices', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByText('Mkt. $5.00');
    await screen.findByText('Mid. $5.10');
});

test('list item with 2 conditions', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByDisplayValue('NONFOIL_NM');
});

test('list item with 1 condition', async () => {
    const qoh: QOH = { NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByDisplayValue('NONFOIL_HP');
});

test('list item condition change', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByDisplayValue('NONFOIL_NM');

    const select = selectDropdownByValue('NONFOIL_NM');
    dropdownOptionClick(select, 'NONFOIL | HP | Qty: 7');

    await screen.getByDisplayValue('NONFOIL_HP');
});

test('list item quantity change', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    const quantityInput = await screen.findByLabelText('Quantity to sell');
    fireEvent.change(quantityInput, { target: { value: 1 } });

    await screen.findByDisplayValue('1');
});

test('list item price change', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    const priceInput = await screen.findByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: 2.34 } });

    await screen.findByDisplayValue('2.34');
});

test('button submission only on valid price and quantity', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    const findButton = currentButton('Add to sale');

    const quantityInput = await screen.findByLabelText('Quantity to sell');
    fireEvent.change(quantityInput, { target: { value: 1 } });

    expect(await findButton()).toBeDisabled();

    const priceInput = await screen.findByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: 2.34 } });

    expect(await findButton()).not.toBeDisabled();
});

test('cannot increase sold quantity past availability', async () => {
    const qoh: QOH = { NONFOIL_NM: 2 };
    const mockCard = { ...bop, qoh };

    await render(<SaleSearchCard card={mockCard} />);

    const currentInput = currentByLabelText('Quantity to sell');

    fireEvent.change(await currentInput(), { target: { value: 2 } });
    expect(await currentInput()).toHaveValue(2);

    fireEvent.change(await currentInput(), { target: { value: 5 } }); // Above limit
    expect(await currentInput()).toHaveValue(2); // Cannot be 5; locked at max
});

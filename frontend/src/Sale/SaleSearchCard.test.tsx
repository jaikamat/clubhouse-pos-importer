import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { QOH, ScryfallCard } from '../utils/ScryfallCard';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import mockHttp from '../utils/testing/mockHttp';
import SaleSearchCard from './SaleSearchCard';

/**
 * Returns a function that caches the current button for repeated assertion
 */
const currentButton = (buttonText: string) => {
    let button: HTMLButtonElement;

    return async () => {
        button = (await screen.findByText(buttonText)).closest('button')!;

        return button;
    };
};

/**
 * Caches a found element for current state assertions
 */
const currentByLabelText = (text: string) => {
    let element: HTMLElement;

    return async () => {
        element = await screen.findByLabelText(text);

        return element;
    };
};

const selectDropdownByValue = (value: string) => {
    const selectContainer = screen.getByDisplayValue(value).parentElement!;
    const select = within(selectContainer).getByRole('button');

    return select;
};

const optionClick = (selectElement: HTMLElement, valueText: string) => {
    fireEvent.mouseDown(selectElement);
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(valueText));
};

const data = {
    marketPrices: { foil: 11.2, normal: 4.56 },
    medianPrices: { foil: 12.78, normal: 5.1 },
};

jest.mock('axios', () => mockHttp(data));

test('list item title and metadata', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    await screen.findByText('Seventh Edition (7ED) - English');
});

test('list item prices', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByText('Mkt. $5.00');
    await screen.findByText('Mid. $5.10');
});

test('list item with 2 conditions', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByDisplayValue('NONFOIL_NM');
});

test('list item with 1 condition', async () => {
    const qoh: QOH = { NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByDisplayValue('NONFOIL_HP');
});

test('list item condition change', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    await screen.findByDisplayValue('NONFOIL_NM');

    const select = selectDropdownByValue('NONFOIL_NM');
    optionClick(select, 'NONFOIL | HP | Qty: 7');

    await screen.getByDisplayValue('NONFOIL_HP');
});

test('list item quantity change', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    const quantityInput = await screen.findByLabelText('Quantity to sell');
    fireEvent.change(quantityInput, { target: { value: 1 } });

    await screen.findByDisplayValue('1');
});

test('list item price change', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    const priceInput = await screen.findByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: 2.34 } });

    await screen.findByDisplayValue('2.34');
});

test('button submission only on valid price and quantity', async () => {
    const qoh: QOH = { NONFOIL_NM: 2, NONFOIL_HP: 7 };
    const mockCard = new ScryfallCard({ ...bop, qoh });

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
    const mockCard = new ScryfallCard({ ...bop, qoh });

    await render(<SaleSearchCard card={mockCard} />);

    const currentInput = currentByLabelText('Quantity to sell');

    fireEvent.change(await currentInput(), { target: { value: 2 } });
    expect(await currentInput()).toHaveValue(2);

    fireEvent.change(await currentInput(), { target: { value: 5 } }); // Above limit
    expect(await currentInput()).toHaveValue(2); // Cannot be 5; locked at max
});

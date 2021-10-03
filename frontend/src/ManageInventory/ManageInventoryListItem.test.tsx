import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import dropdownOptionClick from '../utils/testing/dropdownOptionClick';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import lotus from '../utils/testing/fixtures/blackLotus';
import mockHttp from '../utils/testing/mockHttp';
import selectDropdownByValue from '../utils/testing/selectDropdownByValue';
import ManageInventoryListItem from './ManageInventoryListItem';

const data = {
    marketPrices: { foil: 11.2, normal: 4.56 },
    medianPrices: { foil: 12.78, normal: 5.1 },
};

jest.mock('axios', () => mockHttp(data));

test('manage inventory list item', async () => {
    const mockCard = bop;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    await screen.findByText('Seventh Edition (7ED) - English');
    await screen.findByDisplayValue(0);
    await screen.findByDisplayValue('NONFOIL');
    await screen.findByDisplayValue('NM');
    await screen.findByText('Mkt. $5.00');
    // Manage inventory doesn't show TCG Mid prices
    expect(screen.findByText('Mid. $9.10')).not.toBeInTheDocument;
});

test('select condition', async () => {
    const mockCard = lotus;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');

    const select = selectDropdownByValue('NM');
    dropdownOptionClick(select, 'Heavy Play');

    // Validate the input value has changed
    screen.getByDisplayValue('HP');
});

test('select finish', async () => {
    const mockCard = bop;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    const select = selectDropdownByValue('NONFOIL');
    dropdownOptionClick(select, 'Foil');

    // Validate the input value has changed
    screen.getByDisplayValue('FOIL');

    // Validate the card tcg price changes, and rounds
    await screen.findByText('Mkt. $11.50');
});

test('finish is selectable when allowed', async () => {
    const mockCard = bop;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    const select = selectDropdownByValue('NONFOIL');

    expect(select).not.toHaveAttribute('aria-disabled');
});

test('disables finish when appropriate', async () => {
    const mockCard = lotus;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');
    const select = selectDropdownByValue('NONFOIL');

    expect(select).toHaveAttribute('aria-disabled', 'true');
});

test('auto selects foil if no nonfoil option available', async () => {
    // A foil-only black lotus! Lol...
    const mockCard = { ...lotus, finishes: ['foil'] };

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');
    const select = selectDropdownByValue('FOIL');

    expect(select).toHaveAttribute('aria-disabled', 'true');
});

test('submission is disabled by default', async () => {
    const mockCard = lotus;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');
    const submit = screen.getByText('Add to inventory').closest('button');

    expect(submit).toBeDisabled();
});

test('submission button not disabled with valid quantity', async () => {
    const mockCard = lotus;

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');
    const quantityInput = screen.getByLabelText('Quantity');
    fireEvent.change(quantityInput, { target: { value: 1 } });

    // The previous fireEvent call will initiate a state change, which we need to wait for
    await screen.findByDisplayValue('1');
    const submit = await screen
        .getByText('Add to inventory')
        .closest('button')!;

    expect(submit).not.toBeDisabled();

    /**
     * TODO: Need to test this submission by spying on the mocked axios post method
     */
    // fireEvent.click(submit);
});

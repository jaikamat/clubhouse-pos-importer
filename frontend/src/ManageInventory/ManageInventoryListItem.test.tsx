import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { ScryfallCard } from '../utils/ScryfallCard';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import lotus from '../utils/testing/fixtures/blackLotus';
import ManageInventoryListItem from './ManageInventoryListItem';

const data = {
    marketPrices: { foil: 11.2, normal: 4.56 },
    medianPrices: { foil: 12.78, normal: 5.1 },
};

/**
 * TODO: WOW! This is so cool. So we can mock axios and overwrite its methods
 * This means we can return mock data for useEffect stuff and the tests will be deterministic!
 */
jest.mock('axios', () => ({
    __esModule: true,
    default: {
        get: () => Promise.resolve({ data }),
    },
}));

test('manage inventory list item', async () => {
    const mockCard = new ScryfallCard(bop);

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
    const mockCard = new ScryfallCard(lotus);

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');

    // Get the parent of the <input /> element that has desired value
    const selectContainer = screen.getByDisplayValue('NM').parentElement!;

    // MUI's Select component uses `role=button`
    const select = within(selectContainer).getByRole('button');

    // Click on the select
    fireEvent.mouseDown(select);

    // A listbox appears, and then we assert it
    const listbox = screen.getByRole('listbox');

    fireEvent.click(within(listbox).getByText('Heavy Play'));

    // Validate the input value has changed
    screen.getByDisplayValue('HP');
});

test('select finish', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Birds of Paradise');

    const selectContainer = screen.getByDisplayValue('NONFOIL').parentElement!;
    const select = within(selectContainer).getByRole('button');
    fireEvent.mouseDown(select);
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText('Foil'));

    // Validate the input value has changed
    screen.getByDisplayValue('FOIL');

    // Validate the card tcg price changes, and rounds
    await screen.findByText('Mkt. $11.50');
});

test('finish is selectable when allowed', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    const selectContainer = screen.getByDisplayValue('NONFOIL').parentElement!;
    const select = within(selectContainer).getByRole('button');

    expect(select).not.toHaveAttribute('aria-disabled');
});

test('disables finish when appropriate', async () => {
    const mockCard = new ScryfallCard(lotus);

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');
    const selectContainer = screen.getByDisplayValue('NONFOIL').parentElement!;
    const select = within(selectContainer).getByRole('button');

    expect(select).toHaveAttribute('aria-disabled', 'true');
});

test('auto selects foil if no nonfoil option available', async () => {
    // A foil-only black lotus! Lol...
    const mockCard = new ScryfallCard({ ...lotus, nonfoil: false, foil: true });

    await render(<ManageInventoryListItem card={mockCard} />);

    await screen.findByText('Black Lotus');
    const selectContainer = screen.getByDisplayValue('FOIL').parentElement!;
    const select = within(selectContainer).getByRole('button');

    expect(select).toHaveAttribute('aria-disabled', 'true');
});

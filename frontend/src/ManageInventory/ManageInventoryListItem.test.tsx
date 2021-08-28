import { render, screen } from '@testing-library/react';
import { ScryfallCard } from '../utils/ScryfallCard';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import ManageInventoryListItem from './ManageInventoryListItem';

const data = {
    marketPrices: { foil: 1.23, normal: 4.56 },
    medianPrices: { foil: 6.78, normal: 9.1 },
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

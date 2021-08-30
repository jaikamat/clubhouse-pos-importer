import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import mockHttp from '../utils/testing/mockHttp';
import TotalStoreInventory from './TotalStoreInventory';

const data = {
    ch1: { foilQty: 2, nonfoilQty: 6 },
    ch2: { foilQty: 1, nonfoilQty: 8 },
};

jest.mock('axios', () => mockHttp(data));

test('quantities render', async () => {
    await render(
        <TotalStoreInventory title="Birds of Paradise" searchResults={[]} />
    );

    await screen.findByText('Beaverton totals:');
    await screen.findByText('Hillsboro totals:');
    await screen.findByText('2');
    await screen.findByText('6');
    await screen.findByText('1');
    await screen.findByText('8');
});

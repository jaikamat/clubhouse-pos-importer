import React from 'react';
import MarketPrice from '../../common/MarketPrice';
import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react';

test('Rounded price component renders', async () => {
    render(
        <MarketPrice
            // Arcums Astrolabe
            id="c2462fdf-a594-47d0-8e10-b55901e350d9"
            round
            foil={false}
        />
    );

    // Wait for the loader to disappear
    await waitForElementToBeRemoved(document.querySelector('.spinner'), {
        timeout: 4000,
    });
    // If we round, the price must end in 0.00 or 0.50
    await waitFor(() => screen.getAllByText(/(.50|.00)/i));
});

test('Exact price component renders', async () => {
    render(
        <MarketPrice
            // Arcums Astrolabe
            id="c2462fdf-a594-47d0-8e10-b55901e350d9"
            foil={false}
        />
    );

    // Wait for the loader to disappear
    await waitForElementToBeRemoved(document.querySelector('.spinner'), {
        timeout: 4000,
    });

    await waitFor(() => screen.getAllByText(/(\$\d+\.\d{1,2})/i));
});

test('No price found renders', async () => {
    render(
        <MarketPrice
            // Arcums Astrolabe, Japanese
            id="cf8ca2b0-b199-4855-8cea-cb63587345a8"
            foil={false}
        />
    );

    // Wait for the loader to disappear
    await waitForElementToBeRemoved(document.querySelector('.spinner'), {
        timeout: 4000,
    });
    // JP Prices on scryfall do not exist
    await waitFor(() => screen.getAllByText(/N\/A/i));
});

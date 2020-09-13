import React from 'react';
import MarketPrice from '../../common/MarketPrice';
import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
    fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import mockData from '../data/mockData';
import ReceivingSearchItem from '../../Receiving/ReceivingSearchItem';
import { ReceivingProvider } from '../../context/ReceivingContext';

test('Renders the Receiving search item', async () => {
    const { container } = render(
        <ReceivingProvider>
            <ReceivingSearchItem {...mockData[0]} />
        </ReceivingProvider>
    );

    expect(screen.getByText(/Finish/i).closest('div')).not.toBeDisabled();

    const quantityInput = container.querySelector('.receiving-quantity input');
    const creditPriceInput = container.querySelector('.receiving-credit input');
    const cashPriceInput = container.querySelector('.receiving-cash input');
    const marketPriceInput = container.querySelector('.receiving-market input');

    expect(quantityInput.value).toEqual('1');
    expect(creditPriceInput.value).toEqual('0');
    expect(cashPriceInput.value).toEqual('0');
    expect(marketPriceInput).toBeDisabled();

    const finishAndConditionInput = screen.getAllByRole('listbox');

    expect(finishAndConditionInput).toMatchInlineSnapshot(`
        Array [
          <div
            aria-disabled="false"
            aria-expanded="false"
            class="ui selection dropdown"
            role="listbox"
            tabindex="0"
          >
            <div
              aria-atomic="true"
              aria-live="polite"
              class="text"
              role="alert"
            >
              Nonfoil
            </div>
            <i
              aria-hidden="true"
              class="dropdown icon"
            />
            <div
              class="menu transition"
            >
              <div
                aria-checked="true"
                aria-selected="true"
                class="active selected item"
                role="option"
                style="pointer-events: all;"
              >
                <span
                  class="text"
                >
                  Nonfoil
                </span>
              </div>
              <div
                aria-checked="false"
                aria-selected="false"
                class="item"
                role="option"
                style="pointer-events: all;"
              >
                <span
                  class="text"
                >
                  Foil
                </span>
              </div>
            </div>
          </div>,
          <div
            aria-expanded="false"
            class="ui selection dropdown"
            role="listbox"
            tabindex="0"
          >
            <div
              aria-atomic="true"
              aria-live="polite"
              class="text"
              role="alert"
            >
              Near Mint
            </div>
            <i
              aria-hidden="true"
              class="dropdown icon"
            />
            <div
              class="menu transition"
            >
              <div
                aria-checked="true"
                aria-selected="true"
                class="active selected item"
                role="option"
                style="pointer-events: all;"
              >
                <span
                  class="text"
                >
                  Near Mint
                </span>
              </div>
              <div
                aria-checked="false"
                aria-selected="false"
                class="item"
                role="option"
                style="pointer-events: all;"
              >
                <span
                  class="text"
                >
                  Light Play
                </span>
              </div>
              <div
                aria-checked="false"
                aria-selected="false"
                class="item"
                role="option"
                style="pointer-events: all;"
              >
                <span
                  class="text"
                >
                  Moderate Play
                </span>
              </div>
              <div
                aria-checked="false"
                aria-selected="false"
                class="item"
                role="option"
                style="pointer-events: all;"
              >
                <span
                  class="text"
                >
                  Heavy Play
                </span>
              </div>
            </div>
          </div>,
        ]
    `);
});

test('Ensures validation', async () => {
    const { container } = render(
        <ReceivingProvider>
            <ReceivingSearchItem {...mockData[0]} />
        </ReceivingProvider>
    );

    const quantityInput = container.querySelector('.receiving-quantity input');
    const creditPriceInput = container.querySelector('.receiving-credit input');
    const cashPriceInput = container.querySelector('.receiving-cash input');
    const marketPriceInput = container.querySelector('.receiving-market input');
    const submitButton = screen.getByText(/Add/, { selector: 'button' });

    expect(quantityInput.value).toEqual('1');
    expect(creditPriceInput.value).toEqual('0');
    expect(cashPriceInput.value).toEqual('0');
    expect(marketPriceInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Quantity 1 credit $5
    fireEvent.input(creditPriceInput, { target: { value: 5 } });
    expect(submitButton).not.toBeDisabled();

    // Quantity 1 credit $5 cash $3 no market
    fireEvent.input(cashPriceInput, { target: { value: 3 } });
    expect(submitButton).toBeDisabled();

    // Quantity 1 credit $5 cash $3 market $2
    fireEvent.input(marketPriceInput, { target: { value: 1 } });
    expect(submitButton).not.toBeDisabled();

    // Make quantity 0
    fireEvent.input(quantityInput, { target: { value: 0 } });
    expect(submitButton).toBeDisabled();

    // Make quantity 10, make credit empty string
    fireEvent.input(quantityInput, { target: { value: 10 } });
    fireEvent.input(cashPriceInput, { target: { value: '' } });
    expect(submitButton).toBeDisabled();

    // Test the current quantity in the label
    const foilInventoryLabel = container.querySelector('.foil-label');
    expect(foilInventoryLabel.textContent).toBe('Foil1');
});

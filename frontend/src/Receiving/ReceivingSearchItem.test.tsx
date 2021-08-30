import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ScryfallCard } from '../utils/ScryfallCard';
import currentButton from '../utils/testing/currentButton';
import currentByLabelText from '../utils/testing/currentByLabelText';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import blackLotus from '../utils/testing/fixtures/blackLotus';
import mockHttp from '../utils/testing/mockHttp';
import selectDropdownByValue from '../utils/testing/selectDropdownByValue';
import ReceivingSearchItem from './ReceivingSearchItem';

const data = {
    marketPrices: { foil: 11.2, normal: 4.56 },
    medianPrices: { foil: 12.78, normal: 5.1 },
};

jest.mock('axios', () => mockHttp(data));

test('list item title and metadata', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);

    await screen.findByText('Birds of Paradise');
    await screen.findByText('Seventh Edition (7ED) - English');
});

test('list item prices', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);

    await screen.findByText('Mkt. $4.56'); // Receiving doesn't round
    await screen.findByText('Mid. $5.10');
});

test('list item initial quantity at 1', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);

    await screen.findByDisplayValue('1');
});

test('expect one finish to yield disabled select', async () => {
    const mockCard = new ScryfallCard(blackLotus);

    await render(<ReceivingSearchItem card={mockCard} />);

    await screen.findByText(blackLotus.name);
    const select = selectDropdownByValue('NONFOIL');

    expect(select).toHaveClass('Mui-disabled');
});

test('expect two finishes to yield selectable select', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);

    await screen.findByText(bop.name);
    const select = selectDropdownByValue('NONFOIL');

    expect(select).not.toHaveClass('Mui-disabled');
});

test('expect foil-only to start with foil value', async () => {
    const mockCard = new ScryfallCard({ ...bop, foil: true, nonfoil: false });

    await render(<ReceivingSearchItem card={mockCard} />);

    await screen.findByText(bop.name);
    const select = selectDropdownByValue('FOIL');

    expect(select).toHaveClass('Mui-disabled');
});

test('market price input disabled initially', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);
    const marketPriceInput = await screen.findByLabelText('Market Price');

    expect(marketPriceInput).toBeDisabled();
});

test('market price input not disabled when cash > 0', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);
    const cashPriceInput = currentByLabelText('Cash Price');
    const marketPriceInput = currentByLabelText('Market Price');

    fireEvent.change(await cashPriceInput(), { target: { value: 2.34 } });
    expect(await marketPriceInput()).not.toBeDisabled();

    fireEvent.change(await cashPriceInput(), { target: { value: 0 } });
    expect(await marketPriceInput()).toBeDisabled();
});

test('submission button disabling correctly', async () => {
    const mockCard = new ScryfallCard(bop);

    await render(<ReceivingSearchItem card={mockCard} />);
    const cashPriceInput = currentByLabelText('Cash Price');
    const marketPriceInput = currentByLabelText('Market Price');
    const button = currentButton('Add to list');

    fireEvent.change(await cashPriceInput(), { target: { value: 2.34 } });
    expect(await button()).toBeDisabled();

    fireEvent.change(await marketPriceInput(), { target: { value: 4.5 } });
    expect(await button()).not.toBeDisabled();

    fireEvent.change(await marketPriceInput(), { target: { value: 0 } });
    expect(await button()).toBeDisabled();

    fireEvent.change(await marketPriceInput(), { target: { value: 4.5 } });
    expect(await button()).not.toBeDisabled();

    fireEvent.change(await cashPriceInput(), { target: { value: 0 } });
    expect(await button()).toBeDisabled();
});

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { FC } from 'react';
import { ScryfallCard } from '../utils/ScryfallCard';
import currentButton from '../utils/testing/currentButton';
import bop from '../utils/testing/fixtures/birdsOfParadise';
import lotus from '../utils/testing/fixtures/blackLotus';
import ReceivingProvider, {
    ReceivingCard,
    Trade,
    useReceivingContext,
} from './ReceivingContext';

const ToggleTrade = () => {
    const { selectAll } = useReceivingContext();

    return (
        <div>
            <button onClick={() => selectAll(Trade.Cash)}>Toggle Cash</button>
            <button onClick={() => selectAll(Trade.Credit)}>
                Toggle Credit
            </button>
        </div>
    );
};

const AddButton: FC<{ card: ScryfallCard }> = ({ card }) => {
    const { addToList } = useReceivingContext();

    const onAdd = () =>
        addToList(1, card, {
            marketPrice: 3.33,
            cashPrice: 2.22,
            creditPrice: 1.11,
            finishCondition: 'NONFOIL_NM',
        });

    return <button onClick={onAdd}>Add</button>;
};

const RemoveButton: FC<{ card: ReceivingCard }> = ({ card }) => {
    const { removeFromList } = useReceivingContext();
    const onRemove = () => removeFromList(card);

    return <button onClick={onRemove}>Remove {card.name}</button>;
};

const ReceivingList = () => {
    const { receivingList } = useReceivingContext();
    return (
        <div>
            {receivingList.map((r) => (
                <div key={r.uuid_key}>
                    <p>{r.name}</p>
                    <p>{r.tradeType}</p>
                    <RemoveButton card={r} />
                </div>
            ))}
        </div>
    );
};

test('receiving context adding to list', async () => {
    render(
        <ReceivingProvider>
            <ReceivingList />
            <AddButton card={bop} />
        </ReceivingProvider>
    );

    const button = await currentButton('Add')();
    fireEvent.click(button);
    await screen.findByText('Birds of Paradise');
});

test('remove from list', async () => {
    render(
        <ReceivingProvider>
            <ReceivingList />
            <AddButton card={bop} />
        </ReceivingProvider>
    );

    const addButton = await currentButton('Add')();
    fireEvent.click(addButton);
    await screen.findByText('Birds of Paradise');
    const removeButton = await currentButton('Remove Birds of Paradise')();
    fireEvent.click(removeButton);
    expect(screen.queryByText('Birds of Paradise')).not.toBeInTheDocument();
});

test('add multiple items to list and preserve order', async () => {
    render(
        <ReceivingProvider>
            <ReceivingList />
            <AddButton card={bop} />
            <AddButton card={lotus} />
        </ReceivingProvider>
    );

    const buttons = await screen.findAllByText('Add');
    buttons.forEach((b) => fireEvent.click(b));
    await screen.findByText('Birds of Paradise');
    await screen.findByText('Black Lotus');

    const remove = await currentButton('Remove Birds of Paradise')();
    fireEvent.click(remove);

    await screen.findByText('Black Lotus');
    expect(screen.queryByText('Birds of Paradise')).not.toBeInTheDocument();
});

test('toggle correct trade types', async () => {
    render(
        <ReceivingProvider>
            <ReceivingList />
            <AddButton card={bop} />
            <AddButton card={lotus} />
            <ToggleTrade />
        </ReceivingProvider>
    );

    const buttons = await screen.findAllByText('Add');
    buttons.forEach((b) => fireEvent.click(b));
    await screen.findByText('Birds of Paradise');
    await screen.findByText('Black Lotus');

    expect(screen.getAllByText('CREDIT').length).toBe(2);

    const toggleCash = await currentButton('Toggle Cash')();
    fireEvent.click(toggleCash);

    expect(screen.getAllByText('CASH').length).toBe(2);
});

// TODO: Test commitToInventory and intercept args with mocked axios

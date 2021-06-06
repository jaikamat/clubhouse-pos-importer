import React, { FC, useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar';
import { Header, Divider, Button } from 'semantic-ui-react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';

const BrowseReceiving: FC = () => {
    const [receivedList, setReceivedList] = useState<Received[]>([]);
    const [cardName, setCardName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const received = await browseReceivingQuery({
                cardName,
                startDate: null,
                endDate: null,
            });
            setLoading(false);
            setReceivedList(received);
        })();
    }, [cardName]);

    const handleSearchSelect = (cardName: string) => setCardName(cardName);

    // This used to reset the key of the searchbar to force a rerender via key change and state reset
    // Hacky but gets the job done until we can refactor the search bar component
    const handleClear = () => {
        setCount(count + 1);
        setCardName(null);
    };

    return (
        <div>
            <SearchBar handleSearchSelect={handleSearchSelect} key={count} />
            {cardName && <Button onClick={handleClear}>Clear</Button>}

            <Header as="h2">Browse Receiving</Header>
            <Divider />

            <span>
                <em>Testing, 123!</em>
            </span>
            {loading ? (
                <p>LOADING</p>
            ) : (
                <pre>{JSON.stringify({ receivedList }, null, 2)}</pre>
            )}
        </div>
    );
};

export default BrowseReceiving;

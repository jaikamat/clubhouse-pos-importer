import React, { FC, useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import { Grid, Typography, Box, CircularProgress } from '@material-ui/core';
import ReceivingListItem from './ReceivingListItem';
import Button from '../ui/Button';

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

            <Box py={2}>
                <Typography variant="h5">
                    <strong>Browse Receiving</strong>
                </Typography>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container direction="column" spacing={2}>
                    {receivedList.map((rl) => {
                        return (
                            <Grid item xs={12} md={6} key={rl._id}>
                                <ReceivingListItem received={rl} />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </div>
    );
};

export default BrowseReceiving;

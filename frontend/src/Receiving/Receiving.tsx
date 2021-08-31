import { Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { FC, useEffect, useState } from 'react';
import { Prompt } from 'react-router';
import TotalCardsLabel from '../common/TotalCardsLabel';
import { useReceivingContext } from '../context/ReceivingContext';
import TotalStoreInventory from '../ManageInventory/TotalStoreInventory';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import Loading from '../ui/Loading';
import Placeholder from '../ui/Placeholder';
import { HeaderText } from '../ui/Typography';
import useInterruptExit from '../utils/useInterruptExit';
import ReceivingCart from './ReceivingCart';
import ReceivingListTotals from './ReceivingListTotals';
import ReceivingSearchItem from './ReceivingSearchItem';

interface Props {}

const Receiving: FC<Props> = () => {
    const { setShowPrompt } = useInterruptExit(false);
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {
        searchResults,
        receivingList,
        handleSearchSelect,
        resetSearchResults,
    } = useReceivingContext();

    /**
     * Reset the search results on unmount to clear store
     */
    useEffect(() => {
        return () => resetSearchResults();
    }, []);

    /**
     * Maintains whether or not we show the exit prompt on tab close or refresh
     */
    useEffect(() => {
        if (receivingList.length > 0) {
            setShowPrompt(true);
        } else {
            setShowPrompt(false);
        }
    }, [receivingList]);

    useEffect(() => {
        if (term) {
            (async () => {
                setLoading(true);
                await handleSearchSelect(term);
                setLoading(false);
            })();
        }
    }, [term]);

    return (
        <>
            <Prompt
                message="You have items in your list. Are you sure you wish to leave?"
                when={receivingList.length > 0}
            />
            <Grid container>
                <Grid item xs={12} md={4}>
                    <ControlledSearchBar
                        value={term}
                        onChange={(v) => setTerm(v)}
                    />
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                    <Grid container justify="space-between">
                        <HeaderText>Card Search</HeaderText>
                        {searchResults.length > 0 && (
                            <TotalStoreInventory
                                searchResults={searchResults}
                                title={searchResults[0].name}
                            />
                        )}
                    </Grid>
                    <br />
                    {!loading && !searchResults.length && (
                        <Placeholder
                            icon={<SearchIcon style={{ fontSize: 80 }} />}
                        >
                            <em>"So many cards, so little time."</em>
                        </Placeholder>
                    )}
                    {loading ? (
                        <Loading />
                    ) : (
                        <Grid container spacing={2}>
                            {searchResults.map((card) => (
                                <Grid item xs={12} key={card.id}>
                                    <ReceivingSearchItem card={card} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container justify="space-between">
                        <HeaderText>Buylist</HeaderText>
                        <TotalCardsLabel listLength={receivingList.length} />
                    </Grid>
                    <br />
                    {!receivingList.length && (
                        <Placeholder
                            icon={<SearchIcon style={{ fontSize: 80 }} />}
                        >
                            <em>"If you receive it, they will come."</em>
                        </Placeholder>
                    )}
                    <ReceivingCart cards={receivingList} />
                    <br />
                    {receivingList.length > 0 && <ReceivingListTotals />}
                </Grid>
            </Grid>
        </>
    );
};

export default Receiving;

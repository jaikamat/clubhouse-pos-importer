import React, { FC, useContext, useEffect, useState } from 'react';
import ReceivingSearchItem from './ReceivingSearchItem';
import { Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { ReceivingContext } from '../context/ReceivingContext';
import ReceivingCart from './ReceivingCart';
import TotalCardsLabel from '../common/TotalCardsLabel';
import TotalStoreInventory from '../ManageInventory/TotalStoreInventory';
import { Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';
import SearchBar from '../ui/SearchBar';
import Loading from '../ui/Loading';
import { Prompt } from 'react-router';
import useInterruptExit from '../utils/useInterruptExit';
import ControlledSearchBar from '../ui/ControlledSearchBar';

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
    } = useContext(ReceivingContext);

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
                    <Divider />
                    {!loading && !searchResults.length && (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                <em>"So many cards, so little time."</em>
                            </Header>
                        </Segment>
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
                    <Divider />
                    {!receivingList.length && (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                <em>"If you receive it, they will come."</em>
                            </Header>
                        </Segment>
                    )}
                    <ReceivingCart cards={receivingList} />
                </Grid>
            </Grid>
        </>
    );
};

export default Receiving;

import React, { FC, useContext, useEffect, useState } from 'react';
import ReceivingSearchItem from './ReceivingSearchItem';
import { Divider, Header, Icon, Segment } from 'semantic-ui-react';
import { ReceivingContext } from '../context/ReceivingContext';
import ReceivingList from './ReceivingList';
import TotalCardsLabel from '../common/TotalCardsLabel';
import AllLocationInventory from '../ManageInventory/AllLocationInventory';
import { Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';
import ControlledSearchBar from '../common/ControlledSearchBar';
import Loading from '../ui/Loading';

interface Props {}

const Receiving: FC<Props> = () => {
    const [term, setTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const {
        searchResults,
        receivingList,
        handleSearchSelect,
        resetSearchResults,
    } = useContext(ReceivingContext);

    // Reset the search results on componentDidUnmount to clear store
    useEffect(() => {
        return () => resetSearchResults();
    }, []);

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
            <ControlledSearchBar value={term} onChange={(v) => setTerm(v)} />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                    <Grid container justify="space-between">
                        <HeaderText>Card Search</HeaderText>
                        {searchResults.length > 0 && (
                            <AllLocationInventory
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
                    <ReceivingList cards={receivingList} />
                </Grid>
            </Grid>
        </>
    );
};

export default Receiving;

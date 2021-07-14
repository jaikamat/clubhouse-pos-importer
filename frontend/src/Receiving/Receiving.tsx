import React, { FC, useContext, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import ReceivingSearchItem from './ReceivingSearchItem';
import { Divider } from 'semantic-ui-react';
import { ReceivingContext } from '../context/ReceivingContext';
import DefaultPlaceholder from './DefaultPlaceholder';
import ReceivingList from './ReceivingList';
import TotalCardsLabel from '../common/TotalCardsLabel';
import AllLocationInventory from '../ManageInventory/AllLocationInventory';
import { Grid } from '@material-ui/core';
import { HeaderText } from '../ui/Typography';

interface Props {}

const Receiving: FC<Props> = () => {
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

    return (
        <>
            <SearchBar handleSearchSelect={handleSearchSelect} />
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
                    <DefaultPlaceholder active={!searchResults.length}>
                        "So many cards, so little time."
                    </DefaultPlaceholder>
                    <Grid container spacing={2}>
                        {searchResults.map((card) => (
                            <Grid item xs={12} key={card.id}>
                                <ReceivingSearchItem card={card} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Grid container justify="space-between">
                        <HeaderText>Buylist</HeaderText>
                        <TotalCardsLabel listLength={receivingList.length} />
                    </Grid>
                    <Divider />
                    <DefaultPlaceholder active={!receivingList.length}>
                        "If you receive it, they will come."
                    </DefaultPlaceholder>
                    <ReceivingList cards={receivingList} />
                </Grid>
            </Grid>
        </>
    );
};

export default Receiving;

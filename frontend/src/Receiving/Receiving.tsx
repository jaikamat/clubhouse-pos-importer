import React, { FC, useContext, useEffect } from 'react';
import SearchBar from '../common/SearchBar';
import ReceivingSearchItem from './ReceivingSearchItem';
import { Header, Grid, Divider } from 'semantic-ui-react';
import { ReceivingContext } from '../context/ReceivingContext';
import DefaultPlaceholder from './DefaultPlaceholder';
import ReceivingList from './ReceivingList';
import TotalCardsLabel from '../common/TotalCardsLabel';
import styled from 'styled-components';
import AllLocationInventory from '../ManageInventory/AllLocationInventory';

interface Props {}

const HeaderContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
});

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
            <Grid stackable={true}>
                <Grid.Row>
                    <Grid.Column width="10">
                        <HeaderContainer>
                            <Header as="h2">Card Search</Header>
                            {searchResults.length > 0 && (
                                <div>
                                    <AllLocationInventory
                                        searchResults={searchResults}
                                        title={searchResults[0].name}
                                    />
                                </div>
                            )}
                        </HeaderContainer>

                        <Divider />

                        <DefaultPlaceholder active={!searchResults.length}>
                            "So many cards, so little time."
                        </DefaultPlaceholder>

                        {searchResults.map((card) => (
                            <ReceivingSearchItem key={card.id} card={card} />
                        ))}
                    </Grid.Column>
                    <Grid.Column width="6">
                        <Header as="h2" style={{ display: 'inline-block' }}>
                            Buylist
                            <TotalCardsLabel
                                listLength={receivingList.length}
                            />
                        </Header>

                        <Divider />

                        <DefaultPlaceholder active={!receivingList.length}>
                            "If you receive it, they will come."
                        </DefaultPlaceholder>

                        <ReceivingList cards={receivingList} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default Receiving;

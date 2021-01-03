import React, { useContext } from 'react';
import SearchBar from '../common/SearchBar';
import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import ManageInventoryList from './ManageInventoryList';
import { Segment, Header, Icon, Divider } from 'semantic-ui-react';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';
import styled from 'styled-components';
import SearchMetadata from './SearchMetadata';
import { InventoryContext } from '../context/InventoryContext';

const HeaderContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
});

export default function ManageInventory() {
    const { searchResults, setSearchResults } = useContext(InventoryContext);

    const handleSearchSelect = async (term) => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO, {
                params: { title: term, matchInStock: false },
                headers: makeAuthHeader(),
            });

            const modeledData = data.map((c) => new InventoryCard(c));

            setSearchResults(modeledData);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <SearchBar handleSearchSelect={handleSearchSelect} />
            <br />
            <HeaderContainer>
                <div>
                    <Header as="h2">Manage Inventory</Header>
                </div>
                {searchResults.length > 0 && (
                    <div>
                        <SearchMetadata searchResults={searchResults} />
                    </div>
                )}
            </HeaderContainer>
            <Divider />
            {!searchResults.length && (
                <Segment placeholder>
                    <Header icon>
                        <Icon name="search" />
                        <em>
                            "Searching the future for answers often leads to
                            further questions."
                        </em>
                    </Header>
                </Segment>
            )}

            <ManageInventoryList cards={searchResults} />
        </>
    );
}

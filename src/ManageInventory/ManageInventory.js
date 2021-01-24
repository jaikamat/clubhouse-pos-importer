import React, { useContext } from 'react';
import SearchBar from '../common/SearchBar';
import ManageInventoryList from './ManageInventoryList';
import { Segment, Header, Icon, Divider } from 'semantic-ui-react';
import styled from 'styled-components';
import AllLocationInventory from './AllLocationInventory';
import { InventoryContext } from '../context/InventoryContext';

const HeaderContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
});

export default function ManageInventory() {
    const { searchResults, handleSearchSelect } = useContext(InventoryContext);

    return (
        <>
            <SearchBar handleSearchSelect={handleSearchSelect} />
            <br />
            <HeaderContainer>
                <Header as="h2">Manage Inventory</Header>
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
            {!searchResults.length && (
                <Segment placeholder>
                    <Header icon>
                        <Icon name="search" />
                        <em>
                            "For the first time in his life, Grakk felt a little
                            warm and fuzzy inside."
                        </em>
                    </Header>
                </Segment>
            )}
            <ManageInventoryList cards={searchResults} />
        </>
    );
}

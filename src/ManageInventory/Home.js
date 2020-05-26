import React, { useState } from 'react';
import SearchBar from '../common/SearchBar';
import axios from 'axios';
import makeAuthHeader from '../utils/makeAuthHeader';
import ScryfallCardList from './ScryfallCardList';
import { Segment, Header, Icon, Divider } from 'semantic-ui-react'
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';

export default function Home() {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchSelect = async term => {
        try {
            const { data } = await axios.get(
                GET_CARDS_WITH_INFO, {
                params: { title: term, matchInStock: false },
                headers: makeAuthHeader()
            });

            const modeledData = data.map(c => new InventoryCard(c));

            setSearchResults(modeledData);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <React.Fragment>
            <SearchBar handleSearchSelect={handleSearchSelect} />

            <Header as="h2">Manage Inventory</Header>
            <Divider />

            {!searchResults.length &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="search" />
                        <em>"Searching the future for answers often leads to further questions."</em>
                    </Header>
                </Segment>}

            <ScryfallCardList cards={searchResults} />
        </React.Fragment>
    );
}

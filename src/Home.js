import React, { useState } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import makeAuthHeader from './makeAuthHeader';
import ScryfallCardList from './ScryfallCardList';
import { Segment, Header, Icon, Divider } from 'semantic-ui-react'
import { GET_CARD_QTY_FROM_INVENTORY, GET_SCRYFALL_BULK_BY_TITLE } from './api_resources';
import { InventoryCard } from './utils/ScryfallCard';

export default function Home() {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchSelect = async term => {
        try {
            const { data } = await axios.get(
                GET_SCRYFALL_BULK_BY_TITLE, {
                params: { title: term },
                headers: makeAuthHeader()
            });

            const ids = data.map(el => el.id);

            // Fetches only the in-stock qty of a card tied to an `id`
            const inventoryRes = await axios.post(
                GET_CARD_QTY_FROM_INVENTORY,
                { scryfallIds: ids },
                { headers: makeAuthHeader() }
            );

            const modeledData = data.map(c => new InventoryCard(c));

            // Attached the fetched QOH to the retreived cards
            const modeledDataWithQoh = modeledData.map(card => {
                card.qoh = inventoryRes.data[card.id];
                return card;
            })

            setSearchResults(modeledDataWithQoh);
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

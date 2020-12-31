import React, { useState } from 'react';
import axios from 'axios';
import {
    Grid,
    Segment,
    Header,
    Icon,
    Divider,
    Form,
    Select,
} from 'semantic-ui-react';
import SearchBar from '../common/SearchBar';
import PublicCardList from './PublicCardList';
import { GET_CARDS_WITH_INFO_PUBLIC } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';

const initialState = {
    searchResults: [],
    saleListCards: [],
    searchTerm: '',
    selectedLocation: 'ch1',
};

const locationOptions = [
    { key: 'beaverton', text: 'CH Beaverton', value: 'ch1' },
    { key: 'hillsboro', text: 'CH Hillsboro', value: 'ch2' },
];

function PublicInventory() {
    const [state, setState] = useState(initialState);

    const handleResultSelect = async (term) => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO_PUBLIC, {
                params: {
                    title: term,
                    matchInStock: true,
                    location: state.selectedLocation,
                },
            });

            const modeledData = data.map((c) => new InventoryCard(c));

            setState({
                ...state,
                searchResults: modeledData,
                searchTerm: term,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const { searchResults, searchTerm, selectedLocation } = state;

    const searchNotification = () => {
        if (searchTerm && !searchResults.length) {
            // Check to make sure the user has searched and no results
            return (
                <p>
                    <em>{searchTerm}</em> is out of stock
                </p>
            );
        }
        return <p>Search for a card</p>; // Default text before search
    };

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Field>
                        <label>Card search</label>
                        <SearchBar handleSearchSelect={handleResultSelect} />
                    </Form.Field>
                    <Form.Field
                        label="Store location"
                        control={Select}
                        value={selectedLocation}
                        options={locationOptions}
                        onChange={(_, { value }) =>
                            setState({ ...state, selectedLocation: value })
                        }
                    />
                </Form.Group>
            </Form>
            <Grid stackable={true}>
                <Grid.Column>
                    <Header as="h2">
                        Inventory Search
                        <Header.Subheader>
                            <em>
                                Card prices subject to change. Consult a
                                Clubhouse employee for final estimates
                            </em>
                        </Header.Subheader>
                    </Header>

                    <Divider />

                    {!searchResults.length && (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                <span>{searchNotification()}</span>
                            </Header>
                        </Segment>
                    )}

                    <PublicCardList cards={searchResults} />
                </Grid.Column>
            </Grid>
        </>
    );
}

export default PublicInventory;

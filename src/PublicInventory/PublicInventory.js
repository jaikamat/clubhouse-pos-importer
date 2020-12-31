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
    Button,
} from 'semantic-ui-react';
import SearchBar from '../common/SearchBar';
import PublicCardList from './PublicCardList';
import { GET_CARDS_WITH_INFO_PUBLIC } from '../utils/api_resources';
import { InventoryCard } from '../utils/ScryfallCard';
import { Formik } from 'formik';

const initialState = {
    searchResults: [],
    searchTerm: '',
    selectedLocation: 'ch1',
};

const locationOptions = [
    { key: 'beaverton', text: 'CH Beaverton', value: 'ch1' },
    { key: 'hillsboro', text: 'CH Hillsboro', value: 'ch2' },
];

function PublicInventory() {
    const [state, setState] = useState(initialState);

    const fetchCards = async ({ title, location }) => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO_PUBLIC, {
                params: {
                    title,
                    location,
                    matchInStock: true,
                },
            });

            const modeledData = data.map((c) => new InventoryCard(c));

            setState({
                ...state,
                searchResults: modeledData,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const { searchResults, searchTerm } = state;

    // TODO: This must display if no results
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
        <Formik
            onSubmit={({ searchTerm, selectedLocation }) =>
                fetchCards({
                    title: searchTerm,
                    location: selectedLocation,
                })
            }
            initialValues={{
                searchTerm: '',
                selectedLocation: 'ch1',
            }}
        >
            {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
                <>
                    <Form>
                        <Form.Group>
                            <Form.Field>
                                <label>Card search</label>
                                <SearchBar
                                    handleSearchSelect={(value) =>
                                        setFieldValue('searchTerm', value)
                                    }
                                />
                            </Form.Field>
                            <Form.Field
                                label="Store location"
                                control={Select}
                                value={values.selectedLocation}
                                options={locationOptions}
                                onChange={(_, { value }) =>
                                    setFieldValue('selectedLocation', value)
                                }
                            />
                            <Form.Field>
                                <div style={{ paddingTop: 25 }}>
                                    <Button
                                        primary
                                        disabled={!values.searchTerm}
                                        loading={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        Search
                                    </Button>
                                </div>
                            </Form.Field>
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
            )}
        </Formik>
    );
}

export default PublicInventory;

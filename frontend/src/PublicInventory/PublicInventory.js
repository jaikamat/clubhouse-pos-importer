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
    searchResults: null,
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

    return (
        <>
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
                    isSubmitted: false,
                }}
            >
                {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
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
                )}
            </Formik>
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

                    {state.searchResults === null && (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                <span>Search for a card</span>
                            </Header>
                        </Segment>
                    )}

                    {state.searchResults !== null &&
                        (state.searchResults.length === 0 ? (
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="search" />
                                    <span>No cards found in stock</span>
                                </Header>
                            </Segment>
                        ) : (
                            state.searchResults.length > 0 && (
                                <PublicCardList cards={state.searchResults} />
                            )
                        ))}
                </Grid.Column>
            </Grid>
        </>
    );
}

export default PublicInventory;
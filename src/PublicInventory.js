import React from 'react';
import axios from 'axios';
import {
    Grid,
    Segment,
    Header,
    Icon,
    Divider,
} from 'semantic-ui-react';
import SearchBar from './SearchBar';
import PublicCardList from './PublicCardList';
import { GET_CARDS_BY_TITLE } from './api_resources';

const initialState = {
    searchResults: [],
    saleListCards: [],
    searchTerm: ''
};

export default class PublicInventory extends React.Component {
    state = initialState;

    handleResultSelect = async term => {
        try {
            const { data } = await axios.get(GET_CARDS_BY_TITLE, {
                params: { title: term }
            });

            this.setState({ searchResults: data, searchTerm: term });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const {
            searchResults,
            searchTerm
        } = this.state;

        // Creates text to notify the user of zero-result searches
        const searchNotification = () => {
            if (searchTerm && !searchResults.length) { // Check to make sure the user has searched and no results
                return <p><em>{searchTerm}</em> is out of stock</p>
            }
            return <p>Search for a card</p>; // Default text before search
        }

        return (
            <React.Fragment>
                <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                    <SearchBar handleSearchSelect={this.handleResultSelect} />
                </Grid.Row>
                <br />
                <Grid stackable={true}>
                    <Grid.Column>
                        <Header as="h2">
                            Inventory Search
                            <Header.Subheader>
                                <em>Card prices based on non-premium printings and are subject to change</em>
                            </Header.Subheader>
                        </Header>

                        <Divider />

                        {!searchResults.length &&
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="search" />
                                    <span>{searchNotification()}</span>
                                </Header>
                            </Segment>}

                        <PublicCardList
                            cards={searchResults}
                            addToSaleList={this.addToSaleList}
                        />
                    </Grid.Column>
                </Grid >
            </React.Fragment >
        );
    }
}

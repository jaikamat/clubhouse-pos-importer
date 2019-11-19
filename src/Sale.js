import React from 'react';
import axios from 'axios';
import { Grid, Container, Segment } from 'semantic-ui-react';
import SearchBar from './SearchBar';
import BrowseCardList from './BrowseCardList';

export default class Sale extends React.Component {
    state = {
        searchResults: [],
        saleCards: []
    };

    handleResultSelect = async term => {
        try {
            const { data } = await axios.get(
                `https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByTitle`,
                {
                    params: {
                        title: term
                    }
                }
            );
            console.log(data);

            this.setState({ searchResults: data });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const { searchResults } = this.state;
        return (
            <div>
                <SearchBar handleSearchSelect={this.handleResultSelect} />
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="10">
                            <Segment>
                                <BrowseCardList cards={searchResults} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width="6">
                            <Segment>Sale here</Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

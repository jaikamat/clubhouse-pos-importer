import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';

export default class Sale extends React.Component {
    state = {
        searchResults: [],
        saleCards: []
    };

    handleResultSelect = async term => {
        try {
            const cards = await axios.get(
                `https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsByTitle`,
                {
                    params: {
                        title: term
                    }
                }
            );

            this.setState({ searchResults: cards });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        return <SearchBar handleSearchSelect={this.handleResultSelect} />;
    }
}

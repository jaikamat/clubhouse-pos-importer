import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import ScryfallCardList from './ScryfallCardList';

class Home extends React.Component {
    state = { searchResults: [] };

    handleSearchSelect = async term => {
        const encodedTerm = encodeURI(`"${term}"`);

        try {
            const { data } = await axios.get(
                `https://api.scryfall.com/cards/search?q=!${encodedTerm}%20unique%3Aprints%20game%3Apaper`
            );
            this.setState({ searchResults: data.data });
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <div>
                <p>
                    Creating an app for my Local Game Shop (LGS) to manage their
                    custom inventory via LightSpeed POS!
                </p>

                <SearchBar handleSearchSelect={this.handleSearchSelect} />
                <ScryfallCardList cards={this.state.searchResults} />
            </div>
        );
    }
}

export default Home;

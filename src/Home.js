import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import ScryfallCardList from './ScryfallCardList';

class Home extends React.Component {
    state = { searchResults: [], inventoryQuantities: [] };

    handleSearchSelect = async term => {
        const encodedTerm = encodeURI(`"${term}"`);

        try {
            const searchRes = await axios.get(
                `https://api.scryfall.com/cards/search?q=!${encodedTerm}%20unique%3Aprints%20game%3Apaper`
            );

            const ids = searchRes.data.data.map(el => el.id);
            const inventoryRes = await axios.post(
                'https://us-central1-clubhouse-collection.cloudfunctions.net/getCardsFromInventory',
                {
                    scryfallIds: ids
                }
            );

            console.log(searchRes);
            console.log(inventoryRes);

            this.setState({
                searchResults: searchRes.data.data,
                inventoryQuantities: inventoryRes.data.data
            });
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
                <ScryfallCardList
                    cards={this.state.searchResults}
                    quantities={this.state.inventoryQuantities}
                />
            </div>
        );
    }
}

export default Home;

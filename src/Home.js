import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import ScryfallCardList from './ScryfallCardList';
import { Checkbox } from 'semantic-ui-react';
import { SCRYFALL_SEARCH, GET_CARDS_FROM_INVENTORY } from './api_resources';

class Home extends React.Component {
    state = { searchResults: [], inventoryQuantities: [], showImages: true };

    handleSearchSelect = async term => {
        const encodedTerm = encodeURI(`"${term}"`);

        try {
            const searchRes = await axios.get(
                `${SCRYFALL_SEARCH}?q=!${encodedTerm}%20unique%3Aprints%20game%3Apaper`
            );

            const ids = searchRes.data.data.map(el => el.id);
            const inventoryRes = await axios.post(GET_CARDS_FROM_INVENTORY, {
                scryfallIds: ids
            });

            console.log(searchRes.data);
            console.log(inventoryRes.data);

            this.setState({
                searchResults: searchRes.data.data,
                inventoryQuantities: inventoryRes.data
            });
        } catch (e) {
            console.log(e);
        }
    };

    handleImageToggle = () => {
        this.setState({ showImages: !this.state.showImages });
    };

    render() {
        return (
            <div>
                <SearchBar handleSearchSelect={this.handleSearchSelect} />
                <Checkbox
                    toggle
                    label="Toggle images"
                    onClick={this.handleImageToggle}
                    defaultChecked
                ></Checkbox>
                <ScryfallCardList
                    showImages={this.state.showImages}
                    cards={this.state.searchResults}
                    quantities={this.state.inventoryQuantities}
                />
            </div>
        );
    }
}

export default Home;

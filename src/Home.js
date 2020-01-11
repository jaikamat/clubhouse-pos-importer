import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import makeAuthHeader from './makeAuthHeader';
import ScryfallCardList from './ScryfallCardList';
import { Segment, Header, Icon } from 'semantic-ui-react'
// Un-comment this if hide-image feature is needed
// import { Checkbox, Header } from 'semantic-ui-react';
import { GET_CARD_QTY_FROM_INVENTORY, GET_SCRYFALL_BULK_BY_TITLE } from './api_resources';

class Home extends React.Component {
    state = { searchResults: [], inventoryQuantities: [], showImages: true };

    handleSearchSelect = async term => {
        try {
            const { data } = await axios.get(
                GET_SCRYFALL_BULK_BY_TITLE,
                {
                    params: { title: term },
                    headers: makeAuthHeader()
                }
            );

            const ids = data.map(el => el.id);

            // Fetches only the in-stock qty of a card tied to an `id`
            const inventoryRes = await axios.post(
                GET_CARD_QTY_FROM_INVENTORY,
                { scryfallIds: ids },
                { headers: makeAuthHeader() }
            );

            this.setState({
                searchResults: data,
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
        const { searchResults } = this.state;

        return (
            <div>
                <div>
                    {/* <div>
                        <Header sub>Image Toggle</Header>
                        <Checkbox
                            toggle
                            onClick={this.handleImageToggle}
                            defaultChecked
                        ></Checkbox>
                    </div> */}
                    <SearchBar handleSearchSelect={this.handleSearchSelect} />
                </div>
                {!searchResults.length && <Segment placeholder>
                    <Header icon>
                        <Icon name="search" />
                        Search for cards to update
                                </Header>
                </Segment>}
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

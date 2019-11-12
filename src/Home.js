import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import ScryfallCardList from './ScryfallCardList';
import { Segment } from 'semantic-ui-react';

function createCardList(cards) {
    return cards.map(c => {
        return <ScryfallCardList />;
    });
}

class Home extends React.Component {
    state = { searchResults: [] };

    handleSearchSelect = async term => {
        try {
            const { data } = await axios.get(
                encodeURI(`https://api.scryfall.com/cards/search?q=!"${term}" unique:prints`)
            );
            console.log(data.data);
            this.setState({ searchResults: data.data });
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <div>
                <header className="App-header">
                    <p>
                        Creating an app for my Local Game Shop (LGS) to manage their custom
                        inventory via LightSpeed POS!
                    </p>

                    <SearchBar handleSearchSelect={this.handleSearchSelect} />
                    <Segment.Group>{createCardList(this.state.searchResults)}</Segment.Group>
                </header>
            </div>
        );
    }
}

export default Home;

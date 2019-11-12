import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';

class Home extends React.Component {
    state = { searchResults: [] };

    handleSearchSelect = async term => {
        try {
            const { data } = await axios.get(
                encodeURI(`https://api.scryfall.com/cards/search?q=!"${term}"`)
            );
            console.log(data.data);
            // this.setState({ searchResults: data.data });
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Creating an app for my Local Game Shop (LGS) to manage their custom
                        inventory via LightSpeed POS!
                    </p>

                    <SearchBar handleSearchSelect={this.handleSearchSelect} />
                    <p>{this.state.searchResults}</p>
                </header>
            </div>
        );
    }
}

export default Home;

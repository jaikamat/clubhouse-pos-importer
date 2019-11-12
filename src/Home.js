import React from 'react';
import SearchBar from './SearchBar';

class Home extends React.Component {
    state = { searchTerm: '' };

    handleSearchSelect = term => {
        this.setState({ searchTerm: term });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Creating an app for my Local Game Shop (LGS) to manage their custom
                        inventory via LightSpeed POS!
                    </p>
                    <p>{this.state.searchTerm}</p>

                    <SearchBar handleSearchSelect={this.handleSearchSelect} />
                </header>
            </div>
        );
    }
}

export default Home;

import React from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import axios from 'axios';

class SearchBar extends React.Component {
    state = {
        isLoading: false,
        term: '',
        autocomplete: [],
        results: [],
        defaultSearchValue: 'Search for a card'
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, term: value });

        if (this.state.term.length < 1)
            return this.setState({
                isLoading: false,
                term: '',
                results: [],
                autocomplete: [],
                defaultSearchValue: 'Search for a card'
            });

        setTimeout(async () => {
            const { data } = await axios.get(
                `https://api.scryfall.com/cards/autocomplete?q=${this.state.term}`
            );

            const formattedResults = data.data.map(el => {
                return { title: el };
            });

            this.setState({
                results: formattedResults,
                isLoading: false
            });
        }, 300);
    };

    handleResultSelect = (e, { result }) => {
        this.props.handleSearchSelect(result.title);
    };

    render() {
        const { results, isLoading, defaultSearchValue } = this.state;

        return (
            <Search
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    trailing: true
                })}
                onResultSelect={this.handleResultSelect}
                loading={isLoading}
                results={results}
                placeholder={defaultSearchValue}
            />
        );
    }
}

export default SearchBar;

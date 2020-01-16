import React from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import axios from 'axios';
import makeAuthHeader from './makeAuthHeader';
import { SCRYFALL_AUTOCOMPLETE } from './api_resources';
import $ from 'jquery';

class SearchBar extends React.Component {
    state = {
        isLoading: false,
        term: '',
        autocomplete: [],
        results: [],
        defaultSearchValue: 'Search for a card'
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ term: value });

        if (this.state.term.length < 1) {
            return this.setState({
                isLoading: false,
                term: '',
                results: [],
                autocomplete: [],
                defaultSearchValue: 'Search for a card'
            });
        }

        // Don't search if only 2 letters in box
        if (this.state.term.length < 3) {
            return;
        }

        this.setState({ isLoading: true });

        setTimeout(async () => {
            const { data } = await axios.get(
                `${SCRYFALL_AUTOCOMPLETE}?q=${this.state.term}`,
                { headers: makeAuthHeader() }
            );

            const formattedResults = data.data.map(el => {
                return { title: el };
            }).slice(0, 7);

            this.setState({
                results: formattedResults,
                isLoading: false
            });
        }, 100);
    };

    handleResultSelect = (e, { result }) => {
        this.props.handleSearchSelect(result.title);
    };

    render() {
        const { results, isLoading, defaultSearchValue } = this.state;

        return (
            <Search
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: false,
                    trailing: true
                })}
                onResultSelect={this.handleResultSelect}
                loading={isLoading}
                results={results}
                placeholder={defaultSearchValue}
                selectFirstResult={true}
                id="searchBar"
                onFocus={() => { $('#searchBar').select() }}
            />
        );
    }
}

export default SearchBar;

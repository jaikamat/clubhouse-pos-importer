import React, { useState } from 'react';
import { Search } from 'semantic-ui-react';
import _ from 'lodash';
import axios from 'axios';
import makeAuthHeader from './makeAuthHeader';
import { SCRYFALL_AUTOCOMPLETE } from './api_resources';
import $ from 'jquery';

export default function SearchBar(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleSearchChange = (e, { value }) => { // `value` is the search input string
        if (value.length < 1) {
            setIsLoading(false);
            setResults([]);
            return;
        }

        if (value.length < 3) return; // Don't search if only 2 letters in input

        setIsLoading(true);

        setTimeout(async () => {
            const { data } = await axios.get(
                `${SCRYFALL_AUTOCOMPLETE}?q=${value}`,
                { headers: makeAuthHeader() }
            );

            const formattedResults = data.data.map(el => ({ title: el })).slice(0, 7);

            setResults(formattedResults);
            setIsLoading(false);
        }, 100);
    };

    const handleResultSelect = async (e, { result }) => {
        // This line is a hacky way to get around the fact that if we just select(), then
        // when the user manually clicks the first (or any) result in the resultlist, it does not select,
        // presumably because there is some collision between selecting the resultList element and focusing the input
        setTimeout(() => $('#searchBar').select(), 10);
        try {
            setIsLoading(true);
            await props.handleSearchSelect(result.title);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Search
            onSearchChange={_.debounce(handleSearchChange, 500, { leading: false, trailing: true })}
            onResultSelect={handleResultSelect}
            loading={isLoading}
            results={results}
            placeholder="Search for a card"
            selectFirstResult={true}
            id="searchBar"
            onFocus={e => e.target.select()}
            onBlur={props.onBlur} // Used to clear state in the Browse Inventory feature
        />
    );
}

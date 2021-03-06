import React, { FC, SyntheticEvent, useState } from 'react';
import { Search, SearchProps, SearchResultData } from 'semantic-ui-react';
import _ from 'lodash';
import $ from 'jquery';
import autocompleteQuery from './autocompleteQuery';

interface Props {
    handleSearchSelect: (result: string) => void;
    onBlur?: (event: SyntheticEvent, data: SearchProps) => void;
}

const SearchBar: FC<Props> = ({ handleSearchSelect, onBlur }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<{ title: string }[]>([]);

    // `value` is the search input string
    const handleSearchChange = (_: SyntheticEvent, { value }: SearchProps) => {
        if (!value) return;

        if (value.length < 1) {
            setLoading(false);
            setResults([]);
            return;
        }

        if (value.length < 3) return; // Don't search if only 2 letters in input

        setLoading(true);

        setTimeout(async () => {
            const data = await autocompleteQuery(value);
            const formattedResults = data.map((el) => ({ title: el }));
            setResults(formattedResults);
            setLoading(false);
        }, 100);
    };

    const handleResultSelect = async (
        _: SyntheticEvent,
        { result }: SearchResultData
    ) => {
        // This line is a hacky way to get around the fact that if we just select(), then
        // when the user manually clicks the first (or any) result in the resultlist, it does not select,
        // presumably because there is some collision between selecting the resultList element and focusing the input
        setTimeout(() => $('#searchBar').select(), 10);
        try {
            setLoading(true);
            await handleSearchSelect(result.title);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Search
            onSearchChange={_.debounce(handleSearchChange, 500, {
                leading: false,
                trailing: true,
            })}
            onResultSelect={handleResultSelect}
            loading={loading}
            results={results}
            placeholder="Enter a card title"
            selectFirstResult={true}
            id="searchBar"
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            onBlur={onBlur} // Used to clear state in the Browse Inventory feature
        />
    );
};

export default SearchBar;

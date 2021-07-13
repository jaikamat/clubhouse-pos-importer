import React, { FC, SyntheticEvent, useCallback, useState } from 'react';
import { Search, SearchProps, SearchResultData } from 'semantic-ui-react';
import _ from 'lodash';
import $ from 'jquery';
import autocompleteQuery from './autocompleteQuery';

interface Props {
    value: string;
    onChange: (result: string) => void;
    onBlur?: (event: SyntheticEvent, data: SearchProps) => void;
}

const ControlledSearchBar: FC<Props> = ({ value, onChange, onBlur }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<{ title: string }[]>([]);
    const [internalValue, setInternalValue] = useState<string | undefined>(
        value
    );

    const fetchResults = async (v: string) => {
        setLoading(true);
        const data = await autocompleteQuery(v);
        const formattedResults = data.map((el) => ({ title: el }));
        setResults(formattedResults);
        setLoading(false);
    };

    // Cache so it doesn't create a new instance each render
    const debouncedFetch = useCallback(_.debounce(fetchResults, 500), []);

    // `value` is the search input string
    const handleSearchChange = async (
        _: SyntheticEvent,
        { value: val }: SearchProps
    ) => {
        setInternalValue(val);

        // Skip undefined and short internalValues
        if (!val || val.length < 3) {
            setResults([]);
            return;
        }

        await debouncedFetch(val);
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
            setInternalValue(result.title);
            await onChange(result.title);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Search
            value={internalValue}
            onSearchChange={handleSearchChange}
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

export default ControlledSearchBar;

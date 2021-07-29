import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import autocompleteQuery from '../common/autocompleteQuery';
import Autocomplete, {
    AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

export type Option = { title: string };

interface Props {
    value: Option | null;
    onChange: (result: Option | null) => void;
}

const SearchBar: FC<Props> = ({ value, onChange }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Option[]>([]);
    const [internalValue, setInternalValue] = useState<Option | null>(value);

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
    const handleSearchChange = async (_: ChangeEvent<{}>, val: string) => {
        setInternalValue({ title: val });

        // Skip undefined and short internalValues
        if (!val || val.length < 3) {
            setResults([]);
            return;
        }

        await debouncedFetch(val);
    };

    const handleResultSelect = async (
        _: ChangeEvent<{}>,
        value: Option | null,
        reason: AutocompleteChangeReason
    ) => {
        // If the user clears the input, then we need to reset the state
        if (reason === 'clear') {
            onChange(null);
            return;
        }

        // This line is a hacky way to get around the fact that if we just select(), then
        // when the user manually clicks the first (or any) result in the resultlist, it does not select,
        // presumably because there is some collision between selecting the resultList element and focusing the input
        setTimeout(() => $('#searchBar').select(), 10);

        try {
            setLoading(true);
            setInternalValue(value);
            await onChange(value);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Autocomplete
            id="searchBar"
            selectOnFocus
            value={internalValue}
            onInputChange={handleSearchChange}
            onChange={handleResultSelect}
            loading={loading}
            options={results}
            getOptionLabel={(o) => o.title}
            placeholder="Enter a card title"
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Enter a card title"
                    variant="outlined"
                    size="small"
                />
            )}
        />
    );
};

export default SearchBar;

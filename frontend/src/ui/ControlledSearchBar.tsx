import React, {
    ChangeEvent,
    FC,
    SyntheticEvent,
    useCallback,
    useState,
} from 'react';
import _ from 'lodash';
import $ from 'jquery';
import autocompleteQuery from '../common/autocompleteQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

interface Props {
    value: string;
    onChange: (result: string) => void;
    onBlur?: (event: SyntheticEvent, data: any) => void;
}

type Option = { title: string };

const ControlledSearchBar: FC<Props> = ({ value, onChange, onBlur }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Option[]>([]);
    const [internalValue, setInternalValue] = useState<Option | undefined>();

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

    const handleResultSelect = async (_: ChangeEvent<{}>, result: any) => {
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

    const onFocus = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
        (e.target as HTMLInputElement).select();

    // TODO: onFocus and onBlur
    return (
        <Autocomplete
            id="searchBar"
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
            // onFocus={onFocus}
            // onBlur={onBlur} // Used to clear state in the Browse Inventory feature
        />
    );
};

export default ControlledSearchBar;

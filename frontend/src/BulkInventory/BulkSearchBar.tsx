import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import _ from 'lodash';
import Autocomplete, {
    AutocompleteChangeReason,
} from '@material-ui/lab/Autocomplete';
import { TextField, makeStyles, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import bulkInventoryQuery, { BulkCard } from './bulkInventoryQuery';
import SetIcon from '../ui/SetIcon';

export type Option = BulkCard;

const useStyles = makeStyles({
    /*
     * Prevents the option-list icon from rotating 180 degrees to preserve orientation of custom icon
     */
    popupIndicatorOpen: {
        transform: 'rotate(0deg)',
    },
});

interface Props {
    value: Option | null;
    onChange: (result: Option | null) => void;
    onHighlight?: (o: Option | null) => void;
}

const BulkSearchBar: FC<Props> = ({ value, onChange, onHighlight }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [internalValue, setInternalValue] = useState<Option | null>(value);

    const fetchResults = async (v: string) => {
        setLoading(true);
        const data = await bulkInventoryQuery(v);
        await setOptions(data);
        setLoading(false);
    };

    // Cache so it doesn't create a new instance each render
    const debouncedFetch = useCallback(_.debounce(fetchResults, 750), []);

    const handleSearchChange = async (_: ChangeEvent<{}>, val: string) => {
        // Skip undefined and short internalValues
        if (!val || val.length < 3) {
            setOptions([]);
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
            setInternalValue(null);
            return;
        }

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
        <>
            <Autocomplete
                id="searchBar"
                autoHighlight
                selectOnFocus
                value={internalValue}
                onInputChange={handleSearchChange}
                onChange={handleResultSelect}
                loading={loading}
                options={options}
                getOptionLabel={(o) => o.display_name}
                // We do not want to filter options based on user input
                // This overrides the default behavior
                filterOptions={(o) => o}
                getOptionSelected={(o, v) => o.scryfall_id === v.scryfall_id}
                onHighlightChange={(_, o) => {
                    if (onHighlight) {
                        onHighlight(o);
                    }
                }}
                renderOption={(o) => {
                    return (
                        <div>
                            <Typography component="span">
                                {o.display_name}
                            </Typography>
                            <SetIcon
                                set={o.set_abbreviation}
                                rarity={o.rarity}
                            />
                        </div>
                    );
                }}
                placeholder="Enter a card title"
                closeIcon={null}
                popupIcon={<SearchIcon />}
                noOptionsText="No results found"
                classes={{
                    popupIndicatorOpen: classes.popupIndicatorOpen,
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Enter a card title"
                        variant="outlined"
                        size="small"
                    />
                )}
            />
        </>
    );
};

export default BulkSearchBar;

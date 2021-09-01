import { Grid, makeStyles, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { FormikErrors, useFormik } from 'formik';
import React, { FC, useState } from 'react';
import { ClubhouseLocation } from '../context/AuthProvider';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import Placeholder from '../ui/Placeholder';
import { HeaderText } from '../ui/Typography';
import { ScryfallCard } from '../utils/ScryfallCard';
import PublicCard from './PublicCard';
import publicCardSearchQuery from './publicCardSearchQuery';

interface State {
    searchResults: ScryfallCard[];
    searchTerm: string;
    selectedLocation: ClubhouseLocation;
}

interface FormValues {
    searchTerm: string;
    selectedLocation: ClubhouseLocation;
}

const useStyles = makeStyles({
    gridContainer: {
        display: 'grid',
        gridGap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        justifyItems: 'center',
    },
});

const initialState: State = {
    searchResults: [],
    searchTerm: '',
    selectedLocation: 'ch1',
};

const initialFormState: FormValues = {
    searchTerm: '',
    selectedLocation: 'ch1',
};

const locationOptions = [
    { key: 'beaverton', text: 'CH Beaverton', value: 'ch1' },
    { key: 'hillsboro', text: 'CH Hillsboro', value: 'ch2' },
];

const validate = ({ searchTerm }: FormValues) => {
    let errors: FormikErrors<FormValues> = {};

    if (!searchTerm) {
        errors.searchTerm = 'error';
    }

    return errors;
};

const PublicInventory: FC = () => {
    const { gridContainer } = useStyles();
    const [state, setState] = useState<State>(initialState);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    const fetchCards = async ({
        title,
        location,
    }: {
        title: string;
        location: ClubhouseLocation;
    }) => {
        try {
            const cards = await publicCardSearchQuery({
                title,
                location,
                matchInStock: true,
            });

            setState({
                ...state,
                searchResults: cards,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = async ({ searchTerm, selectedLocation }: FormValues) => {
        await fetchCards({
            title: searchTerm,
            location: selectedLocation,
        });

        setFormSubmitted(true);
    };

    const { values, handleSubmit, setFieldValue, isSubmitting } = useFormik({
        initialValues: initialFormState,
        validate,
        onSubmit,
    });

    return (
        <>
            <HeaderText>Inventory Search</HeaderText>
            <Typography>
                Card prices subject to change. Consult a Clubhouse employee for
                final estimates
            </Typography>
            <br />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <ControlledSearchBar
                            value={values.searchTerm}
                            onChange={(v) => setFieldValue('searchTerm', v)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <ControlledDropdown
                            name="storeLocation"
                            value={values.selectedLocation}
                            options={locationOptions}
                            onChange={(v) =>
                                setFieldValue('selectedLocation', v)
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            type="submit"
                            primary
                            disabled={!values.searchTerm || isSubmitting}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <br />
            {state.searchResults.length > 0 ? (
                <div className={gridContainer}>
                    {state.searchResults.map((c) => (
                        <PublicCard key={c.id} card={c} />
                    ))}
                </div>
            ) : (
                <Placeholder icon={<SearchIcon style={{ fontSize: 80 }} />}>
                    {formSubmitted ? (
                        <span>No cards found in stock</span>
                    ) : (
                        <span>Search for a card</span>
                    )}
                </Placeholder>
            )}
        </>
    );
};

export default PublicInventory;

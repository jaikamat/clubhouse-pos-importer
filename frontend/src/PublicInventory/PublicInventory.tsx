import React, { FC, useState } from 'react';
import { Grid, Segment, Header, Icon } from 'semantic-ui-react';
import { ScryfallCard } from '../utils/ScryfallCard';
import { FormikErrors, useFormik } from 'formik';
import { ClubhouseLocation } from '../context/AuthProvider';
import styled from 'styled-components';
import PublicCard from './PublicCard';
import publicCardSearchQuery from './publicCardSearchQuery';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import ControlledDropdown from '../ui/ControlledDropdown';
import Button from '../ui/Button';
import { Grid as MUIGrid } from '@material-ui/core';

interface State {
    searchResults: ScryfallCard[];
    searchTerm: string;
    selectedLocation: ClubhouseLocation;
}

interface FormValues {
    searchTerm: string;
    selectedLocation: ClubhouseLocation;
}

const GridContainer = styled('div')({
    display: 'grid',
    gridGap: '20px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    justifyItems: 'center',
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
            <MUIGrid container spacing={2} alignItems="center">
                <MUIGrid item xs={12} md={4}>
                    <ControlledSearchBar
                        value={values.searchTerm}
                        onChange={(v) => setFieldValue('searchTerm', v)}
                    />
                </MUIGrid>
                <MUIGrid item xs={12} md={4}>
                    <ControlledDropdown
                        name="storeLocation"
                        value={values.selectedLocation}
                        options={locationOptions}
                        onChange={(v) => setFieldValue('selectedLocation', v)}
                    />
                </MUIGrid>
                <MUIGrid item xs={12} md={4}>
                    <Button
                        type="submit"
                        primary
                        disabled={!values.searchTerm || isSubmitting}
                        onClick={() => handleSubmit()}
                    >
                        Search
                    </Button>
                </MUIGrid>
            </MUIGrid>

            <br />
            <Grid stackable={true}>
                <Grid.Column>
                    <Header as="h2">
                        Inventory Search
                        <Header.Subheader>
                            <em>
                                Card prices subject to change. Consult a
                                Clubhouse employee for final estimates
                            </em>
                        </Header.Subheader>
                    </Header>
                    {state.searchResults.length > 0 ? (
                        <GridContainer>
                            {state.searchResults.map((c) => (
                                <PublicCard key={c.id} card={c} />
                            ))}
                        </GridContainer>
                    ) : (
                        <Segment placeholder>
                            <Header icon>
                                <Icon name="search" />
                                {formSubmitted ? (
                                    <span>No cards found in stock</span>
                                ) : (
                                    <span>Search for a card</span>
                                )}
                            </Header>
                        </Segment>
                    )}
                </Grid.Column>
            </Grid>
        </>
    );
};

export default PublicInventory;

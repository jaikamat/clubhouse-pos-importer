import React, { FC, SyntheticEvent, useState } from 'react';
import { Grid, Segment, Header, Icon, Form, Select } from 'semantic-ui-react';
import { ScryfallCard } from '../utils/ScryfallCard';
import { FormikErrors, useFormik } from 'formik';
import { ClubhouseLocation } from '../context/AuthProvider';
import styled from 'styled-components';
import PublicCard from './PublicCard';
import publicCardSearchQuery from './publicCardSearchQuery';
import ControlledSearchBar from '../ui/ControlledSearchBar';

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

const StyledFormGroup = styled(Form.Group)({
    alignItems: 'flex-end',
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
            <Form>
                <StyledFormGroup widths="5">
                    <Form.Field>
                        <label>Card search</label>
                        <ControlledSearchBar
                            value={values.searchTerm}
                            onChange={(value) =>
                                setFieldValue('searchTerm', value)
                            }
                        />
                    </Form.Field>
                    <Form.Field
                        label="Store location"
                        control={Select}
                        value={values.selectedLocation}
                        options={locationOptions}
                        onChange={(
                            _: SyntheticEvent,
                            { value }: { value: ClubhouseLocation }
                        ) => setFieldValue('selectedLocation', value)}
                    />
                    <Form.Button
                        type="submit"
                        primary
                        disabled={!values.searchTerm}
                        loading={isSubmitting}
                        onClick={() => handleSubmit()}
                    >
                        Search
                    </Form.Button>
                </StyledFormGroup>
            </Form>
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

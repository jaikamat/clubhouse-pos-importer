import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import { Grid, Typography, Box } from '@material-ui/core';
import ReceivingListItem from './ReceivingListItem';
import moment from 'moment';
import { useFormik } from 'formik';
import { Form, Input } from 'semantic-ui-react';
import Loading from '../ui/Loading';
import SearchBar from '../common/SearchBar';

interface FormValues {
    cardName: string;
    startDate: string;
    endDate: string;
}

const initialFormValues: FormValues = {
    cardName: '',
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
};

// Not validations needed for now
const validate = () => {
    return {};
};

const BrowseReceiving: FC = () => {
    const [receivedList, setReceivedList] = useState<Received[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async ({ cardName, startDate, endDate }: FormValues) => {
        setLoading(true);
        const received = await browseReceivingQuery({
            cardName: cardName ? cardName : null,
            startDate,
            endDate,
        });
        setLoading(false);
        setReceivedList(received);
    };

    const { handleChange, values, setFieldValue, handleSubmit } = useFormik({
        initialValues: initialFormValues,
        validate,
        onSubmit,
    });

    useEffect(() => {
        (async () => {
            await onSubmit(initialFormValues);
        })();
    }, []);

    // TODO: Extract relevant inputs for hook use
    return (
        <div>
            <Box pb={2}>
                <Typography variant="h5">
                    <strong>Browse Receiving</strong>
                </Typography>
            </Box>
            <Box pb={2}>
                <Form>
                    <Form.Group widths="6">
                        <Form.Field>
                            <label>Card name</label>
                            <SearchBar
                                handleSearchSelect={(value) => {
                                    setFieldValue('cardName', value);
                                }}
                                // Reset form state after user blurs cardName
                                onBlur={(
                                    event: SyntheticEvent<Element, Event>
                                ) => {
                                    const element = event.target as HTMLInputElement;
                                    setFieldValue('cardName', element.value);
                                }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Start date</label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                onChange={handleChange}
                                defaultValue={initialFormValues.startDate}
                                max={values.endDate}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>End date</label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                onChange={handleChange}
                                defaultValue={initialFormValues.endDate}
                                max={initialFormValues.endDate}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Button
                        type="submit"
                        onClick={() => handleSubmit()}
                        primary
                    >
                        Search
                    </Form.Button>
                </Form>
            </Box>
            {loading ? (
                <Loading />
            ) : (
                <Grid container direction="column" spacing={2}>
                    {receivedList.map((rl) => (
                        <Grid item xs={12} md={6} key={rl._id}>
                            <ReceivingListItem received={rl} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default BrowseReceiving;

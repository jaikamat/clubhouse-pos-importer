import React, { FC, useEffect, useState } from 'react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import { Grid, Typography, Box, CircularProgress } from '@material-ui/core';
import ReceivingListItem from './ReceivingListItem';
import moment from 'moment';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Form } from 'semantic-ui-react';
import FormikSearchBar from '../ui/FormikSearchBar';
import FormikNativeDatePicker from '../ui/FormikNativeDatePicker';

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

    useEffect(() => {
        (async () => {
            await onSubmit(initialFormValues);
        })();
    }, []);

    return (
        <div>
            <Box display="flex">
                <Box pr={2} width={1}>
                    <Formik
                        initialValues={initialFormValues}
                        onSubmit={onSubmit}
                    >
                        <FormikForm>
                            <Form>
                                <Form.Group widths="4">
                                    <Field
                                        name="cardName"
                                        label="Card name"
                                        component={FormikSearchBar}
                                    />
                                    <Field
                                        name="startDate"
                                        label="Start date"
                                        defaultValue={
                                            initialFormValues.startDate
                                        }
                                        component={FormikNativeDatePicker}
                                    />
                                    <Field
                                        name="endDate"
                                        label="End date"
                                        defaultValue={initialFormValues.endDate}
                                        component={FormikNativeDatePicker}
                                    />
                                    <Form.Button type="submit" primary>
                                        Search
                                    </Form.Button>
                                </Form.Group>
                            </Form>
                        </FormikForm>
                    </Formik>
                </Box>
            </Box>
            <Box py={2}>
                <Typography variant="h5">
                    <strong>Browse Receiving</strong>
                </Typography>
            </Box>
            {loading ? (
                <CircularProgress />
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

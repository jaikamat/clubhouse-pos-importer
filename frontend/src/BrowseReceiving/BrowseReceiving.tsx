import React, { FC, useEffect, useState } from 'react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import { Grid, Box } from '@material-ui/core';
import BrowseReceivingItem from './BrowseReceivingItem';
import moment from 'moment';
import { useFormik } from 'formik';
import { Form } from 'semantic-ui-react';
import Loading from '../ui/Loading';
import FormikControlledSearchBar from '../ui/FormikControlledSearchBar';
import { FormikNativeDatePicker } from '../ui/FormikNativeDatePicker';
import { HeaderText, SectionText } from '../ui/Typography';

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

// No validations needed for now
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

    return (
        <div>
            <Box pb={2}>
                <HeaderText>Browse Receiving</HeaderText>
            </Box>
            <SectionText>Filters</SectionText>
            <Box pb={2}>
                <Form>
                    <Form.Group widths="6">
                        <FormikControlledSearchBar
                            label="Card name"
                            value={values.cardName}
                            onChange={(v) => setFieldValue('cardName', v)}
                        />
                        <FormikNativeDatePicker
                            label="Start date"
                            name="startDate"
                            defaultValue={initialFormValues.startDate}
                            handleChange={handleChange}
                            max={values.endDate}
                        />
                        <FormikNativeDatePicker
                            label="End date"
                            name="endDate"
                            defaultValue={initialFormValues.endDate}
                            handleChange={handleChange}
                            max={initialFormValues.endDate}
                        />
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
                <>
                    <SectionText>Results</SectionText>
                    <Grid container direction="column" spacing={2}>
                        {receivedList.map((rl) => (
                            <Grid item xs={12} md={6} key={rl._id}>
                                <BrowseReceivingItem received={rl} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
};

export default BrowseReceiving;

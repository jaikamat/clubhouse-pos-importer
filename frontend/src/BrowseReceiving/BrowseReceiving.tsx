import React, { FC, useEffect, useState } from 'react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import { Grid, Box, Typography, Button, Container } from '@material-ui/core';
import BrowseReceivingItem from './BrowseReceivingItem';
import moment from 'moment';
import Loading from '../ui/Loading';
import { HeaderText, SectionText } from '../ui/Typography';
import BrowseReceivingFilterDialog, {
    FormValues,
} from './BrowseReceivingFilterDialog';
import Placeholder from '../ui/Placeholder';

interface Filters {
    cardName: string;
    startDate: string;
    endDate: string;
}

const initialFilters: Filters = {
    cardName: '',
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
};

function shallowCompare(obj1: Filters, obj2: Filters) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const BrowseReceiving: FC = () => {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [receivedList, setReceivedList] = useState<Received[]>([]);

    const onSubmit = async (formValues: FormValues) => {
        /**
         * If the types of `Filters` changes, we can convert them here
         * from the submitted form values.
         */
        setFilters({ ...filters, ...formValues }); // preserves order when using JSON.stringify to diff
    };

    const onClearFilters = () => setFilters(initialFilters);

    useEffect(() => {
        (async () => {
            const { cardName, startDate, endDate } = filters;

            setLoading(true);
            const received = await browseReceivingQuery({
                cardName: cardName ? cardName : null,
                startDate,
                endDate,
            });
            setLoading(false);
            setReceivedList(received);
        })();
    }, [filters]);

    return (
        <Container>
            <Box pb={2}>
                <HeaderText>Browse Receiving</HeaderText>
            </Box>
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <div>
                        <SectionText>Results</SectionText>
                        <Typography color="textSecondary">
                            {`Searching ${
                                filters.cardName || 'all cards'
                            } from ${filters.startDate} to ${filters.endDate}`}
                        </Typography>
                    </div>
                    <div>
                        {!shallowCompare(initialFilters, filters) && (
                            <Button color="primary" onClick={onClearFilters}>
                                Clear filters
                            </Button>
                        )}
                        <BrowseReceivingFilterDialog
                            filters={filters}
                            onSubmit={onSubmit}
                        />
                    </div>
                </Box>
            </Box>
            <Grid container justify="space-between" spacing={2}>
                <Grid item alignItems="center" md={12} lg={6}></Grid>
                {loading ? (
                    <Loading />
                ) : receivedList.length === 0 ? (
                    <Grid item xs={12}>
                        <Placeholder>No results</Placeholder>
                    </Grid>
                ) : (
                    receivedList.map((rl) => (
                        <Grid item xs={12} key={rl._id}>
                            <BrowseReceivingItem received={rl} />
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
};

export default BrowseReceiving;

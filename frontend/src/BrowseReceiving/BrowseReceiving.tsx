import React, { FC, useEffect, useState } from 'react';
import browseReceivingQuery, { Received } from './browseReceivingQuery';
import { Grid, Box, Typography } from '@material-ui/core';
import BrowseReceivingItem from './BrowseReceivingItem';
import moment from 'moment';
import Loading from '../ui/Loading';
import { HeaderText, SectionText } from '../ui/Typography';
import BrowseReceivingFilterDialog, {
    FormValues,
} from './BrowseReceivingFilterDialog';

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

const BrowseReceiving: FC = () => {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [loading, setLoading] = useState<boolean>(false);
    const [receivedList, setReceivedList] = useState<Received[]>([]);

    const onSubmit = async (formValues: FormValues) => {
        /**
         * If the types of the `filters` change, we can convert them here
         * from the form values before setting the filter state
         */
        setFilters(formValues);
    };

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
        <div>
            <Box pb={2}>
                <HeaderText>Browse Receiving</HeaderText>
            </Box>
            {loading ? (
                <Loading />
            ) : (
                <Grid
                    container
                    justify="space-between"
                    md={12}
                    lg={6}
                    spacing={2}
                >
                    <Grid item alignItems="center" xs={12}>
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
                                    } from ${filters.startDate} to ${
                                        filters.endDate
                                    }`}
                                </Typography>
                            </div>
                            <div>
                                <BrowseReceivingFilterDialog
                                    filters={filters}
                                    onSubmit={onSubmit}
                                />
                            </div>
                        </Box>
                    </Grid>
                    {receivedList.map((rl) => (
                        <Grid item xs={12} key={rl._id}>
                            <BrowseReceivingItem received={rl} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default BrowseReceiving;

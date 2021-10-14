import {
    Box,
    Grid,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Loading from '../ui/Loading';
import { HeaderText, SectionText } from '../ui/Typography';
import displayFinishCondition from '../utils/displayFinishCondition';
import { price } from '../utils/price';
import reportingQuery, { ResponseData } from './reportingQuery';

interface SearchDates {
    startDate: string;
    endDate: string;
}

enum RangeName {
    ALL_TIME = 'All time',
    LAST_MONTH = 'Last 30 days',
}

const allTimeDates: SearchDates = {
    startDate: moment().year(1999).toISOString(),
    endDate: moment().add(1, 'days').toISOString(),
};

const lastMonthDates: SearchDates = {
    startDate: moment().subtract(30, 'days').toISOString(),
    endDate: moment().add(1, 'days').toISOString(),
};

const Reporting = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [report, setReport] = useState<ResponseData | null>(null);
    const [searchName, setSearchName] = useState<RangeName>(RangeName.ALL_TIME);
    const [searchDates, setSearchDates] = useState<SearchDates>(allTimeDates);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await reportingQuery(searchDates);
            setLoading(false);
            setReport(data);
        })();
    }, [searchName, searchDates]);

    const onChange = (e: ChangeEvent<{ value: unknown }>) => {
        if (e.target.value === RangeName.ALL_TIME) {
            setSearchName(RangeName.ALL_TIME);
            setSearchDates(allTimeDates);
        } else if (e.target.value === RangeName.LAST_MONTH) {
            setSearchName(RangeName.LAST_MONTH);
            setSearchDates(lastMonthDates);
        } else {
            throw new Error('Range selection not found');
        }
    };

    return (
        <div>
            <Box
                pb={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <HeaderText>Reporting</HeaderText>
                <Select value={searchName} onChange={onChange}>
                    <MenuItem value={RangeName.ALL_TIME}>All time</MenuItem>
                    <MenuItem value={RangeName.LAST_MONTH}>
                        Last 30 days
                    </MenuItem>
                </Select>
            </Box>
            {loading || !report ? (
                <Loading />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <SectionText>Top cards sold by name</SectionText>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>Quantity sold</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Card name</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.dataPerTitle.map((c) => (
                                        <TableRow key={c._id}>
                                            <TableCell>
                                                {c.quantity_sold}
                                            </TableCell>
                                            <TableCell>{c.card_name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <SectionText>
                            Top cards sold by a single printing
                        </SectionText>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>Quantity sold</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Card name</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Edition</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Finish (Condition)</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Estimated market price</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Quantity on hand</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.dataPerPrinting.map((c) => (
                                        <TableRow key={c._id}>
                                            <TableCell>
                                                {c.quantity_sold}
                                            </TableCell>
                                            <TableCell>{c.card_name}</TableCell>
                                            <TableCell>
                                                {c.card_metadata.set_name}
                                            </TableCell>
                                            <TableCell>
                                                {displayFinishCondition(
                                                    c.finish_condition
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {c.estimated_price !== null &&
                                                c.estimated_price > 0
                                                    ? price(c.estimated_price)
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                {c.quantity_on_hand}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}
        </div>
    );
};

export default Reporting;

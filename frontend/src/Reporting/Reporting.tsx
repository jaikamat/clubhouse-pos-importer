import React, { ChangeEvent, useEffect, useState } from 'react';
import moment from 'moment';
import Loading from '../ui/Loading';
import reportingQuery, { ResponseData } from './reportingQuery';
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
import { HeaderText, SectionText } from '../ui/Typography';
import { uniqueId } from 'lodash';

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
    endDate: moment().toISOString(),
};

const lastMonthDates: SearchDates = {
    startDate: moment().subtract(30, 'days').toISOString(),
    endDate: moment().toISOString(),
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
                    <Grid item xs={12} md={6}>
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
                                    {report.countByCardName.map((c) => (
                                        <TableRow key={uniqueId()}>
                                            <TableCell>{c.count}</TableCell>
                                            <TableCell>
                                                {c.card_title}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                                            <b>Set name</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {report.countByPrinting.map((c) => (
                                        <TableRow key={uniqueId()}>
                                            <TableCell>{c.count}</TableCell>
                                            <TableCell>
                                                {c.card_title}
                                            </TableCell>
                                            <TableCell>
                                                {c.card_metadata.set_name}
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

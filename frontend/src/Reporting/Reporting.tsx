import {
    Box,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Loading from '../ui/Loading';
import { HeaderText, SectionText } from '../ui/Typography';
import displayFinishCondition from '../utils/displayFinishCondition';
import formatDate from '../utils/formatDate';
import { price } from '../utils/price';
import ReportingFilterDialog, { FormValues } from './ReportingFilterDialog';
import reportingQuery, { ResponseData } from './reportingQuery';

interface SearchDates {
    startDate: string;
    endDate: string;
}

const initialDates: SearchDates = {
    startDate: moment().year(2018).format('YYYY-MM-DD'),
    endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
};

const Reporting = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [report, setReport] = useState<ResponseData | null>(null);
    const [searchDates, setSearchDates] = useState<SearchDates>(initialDates);

    const onSubmit = (values: FormValues) => {
        setSearchDates(values);
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await reportingQuery(searchDates);
                setLoading(false);
                setReport(data);
            } catch (err) {
                setLoading(false);
                throw err;
            }
        })();
    }, [searchDates]);

    return (
        <Container>
            <Box
                pb={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <div>
                    <HeaderText>Reporting</HeaderText>
                    <Typography>
                        Viewing data from {formatDate(searchDates.startDate)}{' '}
                        through {formatDate(searchDates.endDate)}
                    </Typography>
                </div>
                <ReportingFilterDialog
                    onSubmit={onSubmit}
                    filters={searchDates}
                />
            </Box>
            {loading || !report ? (
                <Loading />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SectionText>Top cards sold (card title)</SectionText>
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
                                            <b>Quantity on hand (Combined)</b>
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
                                            <TableCell>{c.total_qoh}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <SectionText>
                            Top cards sold (single printing)
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
                                            <TableCell>{c.set_name}</TableCell>
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
        </Container>
    );
};

export default Reporting;

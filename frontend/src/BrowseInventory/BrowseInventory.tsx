import {
    Box,
    CircularProgress,
    Container,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    withStyles,
} from '@material-ui/core';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import React, { FC, useState } from 'react';
import Placeholder from '../ui/Placeholder';
import BrowseInventoryForm, {
    FormValues,
    initialFilters,
} from './BrowseInventoryForm';
import BrowseInventoryRow from './BrowseInventoryRow';
import filteredCardsQuery, {
    Filters,
    ResponseCard,
} from './filteredCardsQuery';

const LIMIT = 100; // Matching the backend for now

export const InvertedLoader = withStyles(({ palette }) => ({
    root: {
        color: palette.common.white,
    },
}))(CircularProgress);

interface State {
    cards: ResponseCard[];
    count: number;
    currentPage: number;
    numPages: number;
    isLoading: boolean;
    cachedFilters: FormValues;
    searchTouched: boolean;
}

const BrowseInventory: FC = () => {
    const [state, setState] = useState<State>({
        cards: [],
        count: 0,
        currentPage: 0,
        numPages: 0,
        isLoading: false,
        cachedFilters: initialFilters,
        searchTouched: false, // Tracks whether the user has initially searched for the 'no results' message
    });

    const fetchData = async (filters: FormValues, page: number) => {
        try {
            setState({ ...state, isLoading: true });

            // Translates form types to the necessary types the query requires
            const queryFilters: Filters = {
                title: filters.title || undefined,
                setName: filters.setName || undefined,
                format: filters.format || undefined,
                minPrice: filters.minPrice
                    ? Number(filters.minPrice)
                    : undefined,
                maxPrice: filters.maxPrice
                    ? Number(filters.maxPrice)
                    : undefined,
                finish: filters.finish || undefined,
                colors:
                    filters.colorsArray.length > 0
                        ? filters.colorsArray.map((c) => {
                              const colorsMap: Record<string, string> = {
                                  White: 'W',
                                  Blue: 'U',
                                  Black: 'B',
                                  Red: 'R',
                                  Green: 'G',
                              };

                              return colorsMap[c];
                          })
                        : undefined,
                colorSpecificity: filters.colorSpecificity || undefined,
                type: filters.typeLine || undefined,
                frame: filters.frame || undefined,
                sortByDirection: filters.sortByDirection,
                sortBy: filters.sortBy,
            };

            const { cards, total } = await filteredCardsQuery(
                queryFilters,
                page
            );

            const numPages = Math.ceil(total / LIMIT);

            setState({
                ...state,
                cards: cards,
                count: total,
                isLoading: false,
                numPages: numPages,
                currentPage: page,
                searchTouched: true,
                // Set the filters for pagination requests later
                cachedFilters: filters,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const { cards, isLoading, currentPage, numPages, count, cachedFilters } =
        state;

    return (
        <Container>
            <Modal open={isLoading}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={1}
                >
                    <InvertedLoader />
                </Box>
            </Modal>
            <Box pb={2}>
                <Typography>
                    <ReportProblemIcon
                        fontSize="small"
                        color="primary"
                        style={{ verticalAlign: 'middle' }}
                    />
                    Prices from this table are updated weekly and are subject to
                    fluctuations. Consult 'New Sale' or 'Manage Inventory' for
                    up-to-date values
                </Typography>
            </Box>
            <BrowseInventoryForm doSubmit={fetchData} />
            <br />
            {!!cards.length && (
                <TableContainer component={Paper} variant="outlined">
                    <Box p={2} display="flex" justifyContent="space-between">
                        <Pagination
                            count={numPages}
                            page={currentPage}
                            onChange={(_, page) =>
                                fetchData(cachedFilters, page)
                            }
                            color="primary"
                        />
                        <Typography>Total results: {count}</Typography>
                    </Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Edition</TableCell>
                                <TableCell>Finish (Condition)</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Estimated Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.map((card) => (
                                <BrowseInventoryRow
                                    key={`${card._id}-${card.finishCondition}`}
                                    card={card}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {!cards.length && (
                <Placeholder icon={<SearchIcon style={{ fontSize: 80 }} />}>
                    {state.searchTouched
                        ? 'No results found'
                        : 'Use the filters to browse inventory'}
                </Placeholder>
            )}
        </Container>
    );
};

export default BrowseInventory;

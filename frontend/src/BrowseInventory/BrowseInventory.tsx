import React, { FC, useState } from 'react';
import BrowseInventoryForm, { initialFilters } from './BrowseInventoryForm';
import BrowseInventoryRow from './BrowseInventoryRow';
import {
    Menu,
    Icon,
    Dimmer,
    Loader,
    Segment,
    Container,
} from 'semantic-ui-react';
import _ from 'lodash';
import filteredCardsQuery, {
    Filters,
    ResponseCard,
} from './filteredCardsQuery';
import Placeholder from '../ui/Placeholder';
import SearchIcon from '@material-ui/icons/Search';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from '@material-ui/core';

const LIMIT = 100; // Matching the backend for now

interface State {
    cards: ResponseCard[];
    count: number;
    currentPage: number;
    numPages: number;
    isLoading: boolean;
    cachedFilters: Filters;
    showPages: any[];
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
        showPages: [],
        searchTouched: false, // Tracks whether the user has initially searched for the 'no results' message
    });

    const fetchData = async (filters: Filters, page: number) => {
        try {
            setState({ ...state, isLoading: true });

            const { cards, total } = await filteredCardsQuery(filters, page);

            const numPages = Math.ceil(total / LIMIT);
            const pages = _.range(1, numPages + 1);
            let showPages;

            // Logic that controls the visibility of page number links
            // Default max number pages to display is 5
            if (page <= 3) {
                showPages = pages.slice(0, 5);
            } else if (page >= numPages - 2) {
                showPages = pages.slice(numPages - 5, numPages);
            } else {
                showPages = pages.slice(page - 2, page + 3);
            }

            setState({
                ...state,
                cards: cards,
                count: total,
                isLoading: false,
                numPages: numPages,
                currentPage: page,
                showPages: showPages,
                searchTouched: true,
                // Set the filters for pagination requests later
                cachedFilters: filters,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const {
        cards,
        isLoading,
        currentPage,
        numPages,
        showPages,
        count,
        cachedFilters,
    } = state;
    const showLeftPageButtons = !(currentPage === 1);
    const showRightPageButtons = !(currentPage === numPages);

    return (
        <Container>
            <Dimmer
                active={isLoading}
                inverted
                page
                style={{ marginTop: '52.63px' }}
            >
                <Loader size="large">Loading</Loader>
            </Dimmer>
            <Segment secondary>
                <Icon name="exclamation triangle" color="blue" />
                Prices from this table are updated weekly and are subject to
                fluctuations. Consult 'New Sale' or 'Manage Inventory' for
                up-to-date values
            </Segment>
            <BrowseInventoryForm doSubmit={fetchData} />
            {!!cards.length && (
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableHead>
                                    <Menu floated>
                                        <Menu.Item>
                                            Viewing page {currentPage} of{' '}
                                            {numPages}
                                        </Menu.Item>
                                    </Menu>
                                    <Menu floated="right">
                                        {showLeftPageButtons && (
                                            <Menu.Item
                                                as="a"
                                                icon
                                                onClick={() =>
                                                    fetchData(
                                                        cachedFilters,
                                                        currentPage - 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron left" />
                                            </Menu.Item>
                                        )}
                                        <React.Fragment>
                                            {showPages.map((p) => {
                                                return (
                                                    <Menu.Item
                                                        key={`page-${p}`}
                                                        onClick={() =>
                                                            fetchData(
                                                                cachedFilters,
                                                                p
                                                            )
                                                        }
                                                        active={
                                                            currentPage === p
                                                        }
                                                        disabled={
                                                            currentPage === p
                                                        }
                                                        as="a"
                                                    >
                                                        {p}
                                                    </Menu.Item>
                                                );
                                            })}
                                        </React.Fragment>
                                        {showRightPageButtons && (
                                            <Menu.Item
                                                as="a"
                                                icon
                                                onClick={() =>
                                                    fetchData(
                                                        cachedFilters,
                                                        currentPage + 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron right" />
                                            </Menu.Item>
                                        )}
                                    </Menu>
                                </TableHead>
                            </TableRow>
                        </TableHead>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Edition</TableCell>
                                <TableCell>Condition</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Price</TableCell>
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
                        <TableFooter>
                            <TableRow>
                                <TableCell>
                                    <Menu floated>
                                        <Menu.Item>
                                            Total results: {count}
                                        </Menu.Item>
                                    </Menu>
                                    <Menu floated="right">
                                        {showLeftPageButtons && (
                                            <Menu.Item
                                                as="a"
                                                icon
                                                onClick={() =>
                                                    fetchData(
                                                        cachedFilters,
                                                        currentPage - 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron left" />
                                            </Menu.Item>
                                        )}
                                        <React.Fragment>
                                            {showPages.map((p) => {
                                                return (
                                                    <Menu.Item
                                                        key={`page-${p}`}
                                                        onClick={() =>
                                                            fetchData(
                                                                cachedFilters,
                                                                p
                                                            )
                                                        }
                                                        active={
                                                            currentPage === p
                                                        }
                                                        disabled={
                                                            currentPage === p
                                                        }
                                                        as="a"
                                                    >
                                                        {p}
                                                    </Menu.Item>
                                                );
                                            })}
                                        </React.Fragment>
                                        {showRightPageButtons && (
                                            <Menu.Item
                                                as="a"
                                                icon
                                                onClick={() =>
                                                    fetchData(
                                                        cachedFilters,
                                                        currentPage + 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron right" />
                                            </Menu.Item>
                                        )}
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
            <br />
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

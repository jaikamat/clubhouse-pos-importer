import React from 'react';
import { GET_CARDS_BY_FILTER } from '../utils/api_resources';
import DeckboxCloneForm from './DeckboxCloneForm';
import DeckboxCloneRow from './DeckboxCloneRow';
import axios from 'axios';
import {
    Table,
    Menu,
    Icon,
    Dimmer,
    Loader,
    Segment,
    Header,
    Container,
} from 'semantic-ui-react';
import _ from 'lodash';
const LIMIT = 100; // Matching the backend for now

export default class DeckboxClone extends React.Component {
    state = {
        data: [],
        count: 0,
        currentPage: 0,
        numPages: 0,
        pageArray: [],
        isLoading: false,
        cachedFilters: {},
        showPages: [],
        searchTouched: false, // Tracks whether the user has initially searched for the 'no results' message
    };

    fetchData = async (filters, page) => {
        try {
            this.setState({ isLoading: true });

            const { data } = await axios.get(GET_CARDS_BY_FILTER, {
                params: { ...filters, page },
            });

            const numPages = Math.ceil(data.total / LIMIT);
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

            this.setState({
                data: data.cards,
                count: data.total,
                isLoading: false,
                numPages: numPages,
                currentPage: page,
                showPages: showPages,
                searchTouched: true,
            });
        } catch (err) {
            console.log(err);
        }
    };

    handleSubmit = async (filters) => {
        this.setState({ cachedFilters: filters }); // Set the filters for pagination requests later
        await this.fetchData(filters, 1); // On submit, starting page mut always be 1
    };

    handlePage = async (page) => {
        await this.fetchData(this.state.cachedFilters, page);
        this.setState({ currentPage: page });
    };

    render() {
        const { data, isLoading, currentPage, numPages, count } = this.state;
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
                <DeckboxCloneForm handleSubmit={this.handleSubmit} />

                {!!data.length && (
                    <Table celled striped compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="5">
                                    <Menu floated="left">
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
                                                    this.handlePage(
                                                        currentPage - 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron left" />
                                            </Menu.Item>
                                        )}

                                        <React.Fragment>
                                            {this.state.showPages.map((p) => {
                                                return (
                                                    <Menu.Item
                                                        key={`page-${p}`}
                                                        onClick={() =>
                                                            this.handlePage(p)
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
                                                    this.handlePage(
                                                        currentPage + 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron right" />
                                            </Menu.Item>
                                        )}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Edition</Table.HeaderCell>
                                <Table.HeaderCell>Condition</Table.HeaderCell>
                                <Table.HeaderCell>Qty</Table.HeaderCell>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {data.map((d) => (
                                <DeckboxCloneRow
                                    {...d}
                                    key={`${d._id}${d.inventory.k}`}
                                />
                            ))}
                        </Table.Body>

                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan="5">
                                    <Menu floated="left">
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
                                                    this.handlePage(
                                                        currentPage - 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron left" />
                                            </Menu.Item>
                                        )}

                                        <React.Fragment>
                                            {this.state.showPages.map((p) => {
                                                return (
                                                    <Menu.Item
                                                        key={`page-${p}`}
                                                        onClick={() =>
                                                            this.handlePage(p)
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
                                                    this.handlePage(
                                                        currentPage + 1
                                                    )
                                                }
                                            >
                                                <Icon name="chevron right" />
                                            </Menu.Item>
                                        )}
                                    </Menu>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                )}

                {!data.length && (
                    <Segment placeholder>
                        <Header icon>
                            <Icon name="search" />
                            {this.state.searchTouched
                                ? 'No results found'
                                : 'Use the filters to browse inventory'}
                        </Header>
                    </Segment>
                )}
            </Container>
        );
    }
}

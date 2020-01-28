import React from 'react';
import SearchBar from './SearchBar';
import { GET_SET_NAMES } from './api_resources';
import axios from 'axios';
import { Form, Input, Select, Dropdown, Segment } from 'semantic-ui-react';

const formatDropdownOptions = [
    { key: 'qw', value: "", text: "None" },
    { key: 'we', value: "standard", text: "Standard" },
    { key: 'er', value: "future", text: "Future" },
    { key: 'rt', value: "historic", text: "Historic" },
    { key: 'ty', value: "pioneer", text: "Pioneer" },
    { key: 'yu', value: "modern", text: "Modern" },
    { key: 'ui', value: "legacy", text: "Legacy" },
    { key: 'io', value: "pauper", text: "Pauper" },
    { key: 'op', value: "vintage", text: "Vintage" },
    { key: 'as', value: "penny", text: "Penny" },
    { key: 'sd', value: "commander", text: "Commander" },
    { key: 'df', value: "brawl", text: "Brawl" },
    { key: 'fg', value: "duel", text: "Duel" },
    { key: 'gh', value: "oldschool", text: "Oldschool" }
];

const priceFilterDropdownOptions = [
    { key: 'gte', value: 'gte', text: '>=' },
    { key: 'lte', value: 'lte', text: '<=' },
    { key: 'gtx', value: 'gt', text: '>' },
    { key: 'ltx', value: 'lt', text: '<' }
];

const finishDropdownOptions = [
    { key: 'nonfoil_foil', value: '', text: 'None' },
    { key: 'nonfoil', value: 'NONFOIL', text: 'Nonfoil' },
    { key: 'foil', value: 'FOIL', text: 'Foil' }
];

const sortByDropdownOptions = [
    { key: 'pricesort', value: 'price', text: 'Price' },
    { key: 'alphasort', value: 'name', text: 'Card Name' }
];

const sortByDirectionDropdownOptions = [
    { key: 'descdirsort', value: 1, text: 'Ascending' },
    { key: 'ascdirsort', value: -1, text: 'Descending' }
];

const initialState = {
    title: '',
    setName: '',
    format: '',
    priceNum: '',
    priceFilter: 'gte',
    finish: '',
    sortBy: 'price',
    sortByDirection: -1,
    setNames: []
}

export default class DeckboxCloneForm extends React.Component {
    state = { editionDropdownOptions: [], ...initialState };

    handleSearchSelect = name => this.setState({ title: name });

    // When the user blurs the search field, we need to re-set state. Otherwise it won't clear from handleSearchSelect()
    handleSearchBlur = (e, d) => this.setState({ title: e.target.value });

    handleChange = (e, { value }) => this.setState({ [e.target.name]: value });

    handleDropdownChange = (e, data) => this.setState({ [data.name]: data.value });

    async componentDidMount() {
        const { data } = await axios.get(GET_SET_NAMES);
        const setNameOptions = data.map((d, idx) => {
            return { key: `set${idx}`, value: d, text: d };
        })
        const concatWithBlankOption = [{ key: 'snull', value: "", text: "None" }].concat(setNameOptions);
        this.setState({ editionDropdownOptions: concatWithBlankOption });
    }

    render() {
        const {
            title,
            setName,
            format,
            priceNum,
            priceFilter,
            finish,
            sortBy,
            sortByDirection
        } = this.state;

        return (
            <Segment>
                <h3>Filters</h3>
                <Form>
                    <Form.Group widths="4">
                        <Form.Field>
                            <label>Card Name</label>
                            <SearchBar
                                handleSearchSelect={this.handleSearchSelect}
                                value={this.state.title}
                                name="title"
                                onBlur={this.handleSearchBlur}
                            />
                        </Form.Field>
                        <Form.Field
                            control={Select}
                            label="Format"
                            placeholder="Format"
                            options={formatDropdownOptions}
                            name="format"
                            onChange={this.handleDropdownChange}
                        />
                        <Form.Field
                            control={Select}
                            label="Edition"
                            placeholder="Edition"
                            search
                            options={this.state.editionDropdownOptions}
                            name="setName"
                            onChange={this.handleDropdownChange}
                        />
                        <Form.Field
                            control={Select}
                            label="Finish"
                            placeholder="Finish"
                            options={finishDropdownOptions}
                            name="finish"
                            onChange={this.handleDropdownChange}
                        />
                    </Form.Group>
                    <Form.Group widths="4">
                        <Form.Field>
                            <label>Price Filter</label>
                            <Input
                                label={<Dropdown
                                    options={priceFilterDropdownOptions}
                                    name="priceFilter"
                                    defaultValue="gte"
                                    onChange={this.handleDropdownChange}
                                />}
                                placeholder="Enter a price"
                                labelPosition="left"
                                name="priceNum"
                                type="number"
                                onChange={this.handleDropdownChange}
                            />
                        </Form.Field>
                        <Form.Field
                            control={Select}
                            label="Sort By"
                            placeholder=""
                            options={sortByDropdownOptions}
                            defaultValue='price'
                            name="sortBy"
                            onChange={this.handleDropdownChange}
                        />
                        <Form.Field
                            control={Select}
                            label="Order"
                            options={sortByDirectionDropdownOptions}
                            defaultValue={-1}
                            name="sortByDirection"
                            onChange={this.handleDropdownChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Button primary onClick={() => this.props.handleSubmit({
                            title,
                            setName,
                            format,
                            priceNum,
                            priceFilter,
                            finish,
                            sortBy,
                            sortByDirection
                        })}>Submit</Form.Button>
                    </Form.Group>
                </Form>
            </Segment>
        )
    }
}
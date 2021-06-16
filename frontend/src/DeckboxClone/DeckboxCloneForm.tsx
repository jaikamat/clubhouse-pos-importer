import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar';
import { GET_SET_NAMES } from '../utils/api_resources';
import axios from 'axios';
import { Form, Input, Select, Dropdown, Segment } from 'semantic-ui-react';
import makeAuthHeader from '../utils/makeAuthHeader';

const formatDropdownOptions = [
    { key: 'qw', value: '', text: 'None' },
    { key: 'we', value: 'standard', text: 'Standard' },
    { key: 'er', value: 'future', text: 'Future' },
    { key: 'rt', value: 'historic', text: 'Historic' },
    { key: 'ty', value: 'pioneer', text: 'Pioneer' },
    { key: 'yu', value: 'modern', text: 'Modern' },
    { key: 'ui', value: 'legacy', text: 'Legacy' },
    { key: 'io', value: 'pauper', text: 'Pauper' },
    { key: 'op', value: 'vintage', text: 'Vintage' },
    { key: 'as', value: 'penny', text: 'Penny' },
    { key: 'sd', value: 'commander', text: 'Commander' },
    { key: 'df', value: 'brawl', text: 'Brawl' },
    { key: 'fg', value: 'duel', text: 'Duel' },
    { key: 'gh', value: 'oldschool', text: 'Oldschool' },
];

const priceFilterDropdownOptions = [
    { key: 'gte', value: 'gte', text: '>=' },
    { key: 'lte', value: 'lte', text: '<=' },
    { key: 'gtx', value: 'gt', text: '>' },
    { key: 'ltx', value: 'lt', text: '<' },
];

const finishDropdownOptions = [
    { key: 'nonfoil_foil', value: '', text: 'None' },
    { key: 'nonfoil', value: 'NONFOIL', text: 'Nonfoil' },
    { key: 'foil', value: 'FOIL', text: 'Foil' },
];

const sortByDropdownOptions = [
    { key: 'pricesort', value: 'price', text: 'Price' },
    { key: 'alphasort', value: 'name', text: 'Card Name' },
];

const sortByDirectionDropdownOptions = [
    { key: 'descdirsort', value: 1, text: 'Ascending' },
    { key: 'ascdirsort', value: -1, text: 'Descending' },
];

const sortByColorDropdownOptions = [
    { key: 'w', value: 'W', text: 'White' },
    { key: 'u', value: 'U', text: 'Blue' },
    { key: 'b', value: 'B', text: 'Black' },
    { key: 'r', value: 'R', text: 'Red' },
    { key: 'g', value: 'G', text: 'Green' },
];

const colorSpecificityDropdownOptions = [
    { key: 'all', value: '', text: 'None' },
    { key: 'colorless', value: 'colorless', text: 'Colorless only' },
    { key: 'mono', value: 'mono', text: 'Monocolor only' },
    { key: 'multi', value: 'multi', text: 'Multicolor only' },
];

const typeLineOptions = [
    { key: 'na', value: '', text: 'None' },
    { key: 'artifact', value: 'Artifact', text: 'Artifact' },
    { key: 'creature', value: 'Creature', text: 'Creature' },
    { key: 'enchantment', value: 'Enchantment', text: 'Enchantment' },
    { key: 'instant', value: 'Instant', text: 'Instant' },
    { key: 'land', value: 'Land', text: 'Land' },
    { key: 'planeswalker', value: 'Planeswalker', text: 'Planeswalker' },
    { key: 'sorcery', value: 'Sorcery', text: 'Sorcery' },
    { key: 'tribal', value: 'Tribal', text: 'Tribal' },
];

const frameOptions = [
    { key: 'na', value: '', text: 'None' },
    { key: 'borderless', value: 'borderless', text: 'Borderless' },
    { key: 'extendedArt', value: 'extendedArt', text: 'Extended Art' },
    { key: 'extendedArt', value: 'showcase', text: 'Showcase' },
];

const initialState = {
    title: '',
    setName: '',
    format: '',
    priceNum: '',
    priceFilter: 'gte',
    finish: '',
    sortBy: 'price',
    colorsArray: [],
    sortByDirection: -1,
    colorSpecificity: '',
    typeLine: '',
    setNames: [],
    frame: '',
};

interface DropdownOption {
    key: string;
    value: string;
    text: string;
}

interface State {
    editionDropdownOptions: DropdownOption[];
    title: string;
    setName: string;
    format: string;
    priceNum: string;
    priceFilter: string;
    finish: string;
    sortBy: string;
    colorsArray: string[];
    sortByDirection: number;
    colorSpecificity: string;
    typeLine: string;
    setNames: string[];
    frame: string;
}

interface Response {
    data: string[];
}

interface SubmitArgument {
    title?: string;
    setName?: string;
    format?: string;
    price?: number;
    finish?: string;
    colors?: string;
    colorSpecificity?: string;
    type?: string;
    frame?: string;
    sortByDirection: number;
    priceOperator: string;
    sortBy: string;
}

interface Props {
    handleSubmit: (v: SubmitArgument) => Promise<void>;
}

const DeckboxCloneForm: FC<Props> = ({ handleSubmit }) => {
    const [state, setState] = useState<State>({
        ...initialState,
        editionDropdownOptions: [],
    });

    const handleSearchSelect = (name: string) => {
        setState({ ...state, title: name });
    };

    // When the user blurs the search field, we need to re-set state. Otherwise it won't clear from handleSearchSelect()
    const handleSearchBlur = (event: SyntheticEvent<Element, Event>) => {
        const element = event.target as HTMLInputElement;
        setState({ ...state, title: element.value });
    };

    // const handleChange = (e: SyntheticEvent, { value }) => setState({ ...state, [e.target.name]: e.target.value });

    const handleDropdownChange = (
        e: SyntheticEvent,
        data: Record<string, string>
    ) => setState({ ...state, [data.name]: data.value });

    useEffect(() => {
        (async () => {
            const { data }: Response = await axios.get(GET_SET_NAMES, {
                headers: makeAuthHeader(),
            });
            const setNameOptions = data.map((d, idx) => {
                return { key: `set${idx}`, value: d, text: d };
            });
            const concatWithBlankOption = [
                { key: 'snull', value: '', text: 'None' },
            ].concat(setNameOptions);
            setState({
                ...state,
                editionDropdownOptions: concatWithBlankOption,
            });
        })();
    }, []);

    const {
        title,
        setName,
        format,
        priceNum,
        priceFilter,
        finish,
        sortBy,
        sortByDirection,
        colorsArray,
        colorSpecificity,
        typeLine,
        frame,
    } = state;

    // Sort the colors here and concat prior to sending to the backend
    const colors = colorsArray.sort().join('');

    return (
        <Segment>
            <h3>Filters</h3>
            <Form>
                <Form.Group widths="4">
                    <Form.Field>
                        <label>Card Name</label>
                        <SearchBar
                            handleSearchSelect={handleSearchSelect}
                            onBlur={handleSearchBlur}
                        />
                    </Form.Field>
                    <Form.Field
                        control={Select}
                        label="Format"
                        placeholder="Format"
                        options={formatDropdownOptions}
                        name="format"
                        onChange={handleDropdownChange}
                    />
                    <Form.Field
                        control={Select}
                        label="Edition"
                        placeholder="Edition"
                        search
                        options={state.editionDropdownOptions}
                        name="setName"
                        onChange={handleDropdownChange}
                    />
                    <Form.Field
                        control={Select}
                        label="Finish"
                        placeholder="Finish"
                        options={finishDropdownOptions}
                        name="finish"
                        onChange={handleDropdownChange}
                    />
                </Form.Group>
                <Form.Group widths="4">
                    <Form.Field
                        control={Select}
                        multiple
                        label="Colors"
                        placeholder="Colors"
                        options={sortByColorDropdownOptions}
                        name="colorsArray"
                        onChange={handleDropdownChange}
                    />

                    <Form.Field
                        control={Select}
                        label="Color specificity"
                        placeholder="Color specificity"
                        options={colorSpecificityDropdownOptions}
                        name="colorSpecificity"
                        onChange={handleDropdownChange}
                    />

                    <Form.Field
                        control={Select}
                        label="Type Line"
                        placeholder="Type Line"
                        options={typeLineOptions}
                        name="typeLine"
                        onChange={handleDropdownChange}
                    />

                    <Form.Field
                        control={Select}
                        label="Frame Effects"
                        placeholder="Effect"
                        options={frameOptions}
                        name="frame"
                        onChange={handleDropdownChange}
                    />

                    <Form.Field>
                        <label>Price Filter</label>
                        <Input
                            label={
                                <Dropdown
                                    options={priceFilterDropdownOptions}
                                    name="priceFilter"
                                    defaultValue="gte"
                                    onChange={handleDropdownChange}
                                />
                            }
                            placeholder="Enter a price"
                            labelPosition="left"
                            name="priceNum"
                            type="number"
                            onChange={handleDropdownChange}
                        />
                    </Form.Field>
                </Form.Group>

                <h3>{'Sort & Order'}</h3>

                <Form.Group>
                    <Form.Field
                        control={Select}
                        label="Sort By"
                        placeholder=""
                        options={sortByDropdownOptions}
                        defaultValue="price"
                        name="sortBy"
                        onChange={handleDropdownChange}
                    />
                    <Form.Field
                        control={Select}
                        label="Order"
                        options={sortByDirectionDropdownOptions}
                        defaultValue={-1}
                        name="sortByDirection"
                        onChange={handleDropdownChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Button
                        primary
                        onClick={async () => {
                            console.log({ title });
                            await handleSubmit({
                                title: title || undefined,
                                setName: setName || undefined,
                                format: format || undefined,
                                price: Number(priceNum) || undefined,
                                finish: finish || undefined,
                                colors: colors || undefined,
                                colorSpecificity: colorSpecificity || undefined,
                                type: typeLine || undefined,
                                frame: frame || undefined,
                                sortByDirection: sortByDirection,
                                priceOperator: priceFilter,
                                sortBy: sortBy,
                            });
                        }}
                    >
                        Submit
                    </Form.Button>
                </Form.Group>
            </Form>
        </Segment>
    );
};

export default DeckboxCloneForm;

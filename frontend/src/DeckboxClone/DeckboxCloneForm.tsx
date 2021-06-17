import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import SearchBar from '../common/SearchBar';
import { Form, Input, Segment } from 'semantic-ui-react';
import { Formik, FormikHelpers, Form as FormikForm, Field } from 'formik';
import FormikSelectField from '../ui/FormikSelectField';
import FormikDropdown from '../ui/FormikDropdown';
import setNameQuery from './setNameQuery';

const formatDropdownOptions: DropdownOption[] = [
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

const priceOperatorDropdownOptions: DropdownOption[] = [
    { key: 'gte', value: 'gte', text: '>=' },
    { key: 'lte', value: 'lte', text: '<=' },
    { key: 'gtx', value: 'gt', text: '>' },
    { key: 'ltx', value: 'lt', text: '<' },
];

const finishDropdownOptions: DropdownOption[] = [
    { key: 'nonfoil_foil', value: '', text: 'None' },
    { key: 'nonfoil', value: 'NONFOIL', text: 'Nonfoil' },
    { key: 'foil', value: 'FOIL', text: 'Foil' },
];

const sortByDropdownOptions: DropdownOption[] = [
    { key: 'pricesort', value: 'price', text: 'Price' },
    { key: 'alphasort', value: 'name', text: 'Card Name' },
];

const sortByDirectionDropdownOptions: DropdownOption[] = [
    { key: 'descdirsort', value: 1, text: 'Ascending' },
    { key: 'ascdirsort', value: -1, text: 'Descending' },
];

const sortByColorDropdownOptions: DropdownOption[] = [
    { key: 'w', value: 'W', text: 'White' },
    { key: 'u', value: 'U', text: 'Blue' },
    { key: 'b', value: 'B', text: 'Black' },
    { key: 'r', value: 'R', text: 'Red' },
    { key: 'g', value: 'G', text: 'Green' },
];

const colorSpecificityDropdownOptions: DropdownOption[] = [
    { key: 'all', value: '', text: 'None' },
    { key: 'colorless', value: 'colorless', text: 'Colorless only' },
    { key: 'mono', value: 'mono', text: 'Monocolor only' },
    { key: 'multi', value: 'multi', text: 'Multicolor only' },
];

const typeLineOptions: DropdownOption[] = [
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

const frameOptions: DropdownOption[] = [
    { key: 'na', value: '', text: 'None' },
    { key: 'borderless', value: 'borderless', text: 'Borderless' },
    { key: 'extendedArt', value: 'extendedArt', text: 'Extended Art' },
    { key: 'extendedArt', value: 'showcase', text: 'Showcase' },
];

interface DropdownOption {
    key: string;
    value: string | number;
    text: string;
}

export interface Filters {
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

interface FormValues {
    title: string;
    setName: string;
    format: string;
    price: number;
    finish: string;
    colorsArray: string[];
    colorSpecificity: string;
    typeLine: string;
    frame: string;
    sortByDirection: number;
    priceOperator: string;
    sortBy: string;
}

export const initialFilters: FormValues = {
    title: '',
    setName: '',
    format: '',
    price: 0,
    priceOperator: 'gte',
    finish: '',
    sortBy: 'price',
    colorsArray: [],
    sortByDirection: -1,
    colorSpecificity: '',
    typeLine: '',
    frame: '',
};

interface Props {
    doSubmit: (v: Filters) => Promise<void>;
}

const DeckboxCloneForm: FC<Props> = ({ doSubmit }) => {
    const [editionDropdownOptions, setEditionDropdownOptions] = useState<
        DropdownOption[]
    >([]);

    const onSubmit = async (
        values: FormValues,
        {}: FormikHelpers<FormValues>
    ) => {
        try {
            await doSubmit({
                title: values.title || undefined,
                setName: values.setName || undefined,
                format: values.format || undefined,
                price: Number(values.price) || undefined,
                finish: values.finish || undefined,
                colors:
                    values.colorsArray.length > 0
                        ? values.colorsArray.sort().join('')
                        : undefined,
                colorSpecificity: values.colorSpecificity || undefined,
                type: values.typeLine || undefined,
                frame: values.frame || undefined,
                sortByDirection: values.sortByDirection,
                priceOperator: values.priceOperator,
                sortBy: values.sortBy,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        (async () => {
            const names = await setNameQuery();

            const setNameOptions = names.map((name, idx) => ({
                key: `set${idx}`,
                value: name,
                text: name,
            }));

            const concatWithBlankOption = [
                { key: 'snull', value: '', text: 'None' },
                ...setNameOptions,
            ];

            setEditionDropdownOptions(concatWithBlankOption);
        })();
    }, []);

    return (
        <Segment>
            <h3>Filters</h3>
            <Formik initialValues={initialFilters} onSubmit={onSubmit}>
                {({ handleChange, setFieldValue }) => (
                    <FormikForm>
                        <Form>
                            <Form.Group widths="4">
                                <Form.Field>
                                    <label>Card Name</label>
                                    <SearchBar
                                        handleSearchSelect={(value) => {
                                            setFieldValue('title', value);
                                        }}
                                        // Reset form state after user blurs title
                                        onBlur={(
                                            event: SyntheticEvent<
                                                Element,
                                                Event
                                            >
                                        ) => {
                                            const element = event.target as HTMLInputElement;
                                            setFieldValue(
                                                'title',
                                                element.value
                                            );
                                        }}
                                    />
                                </Form.Field>
                                <Field
                                    name="format"
                                    label="Format"
                                    options={formatDropdownOptions}
                                    component={FormikSelectField}
                                />
                                <Field
                                    name="setName"
                                    label="Edition"
                                    options={editionDropdownOptions}
                                    component={FormikSelectField}
                                    search
                                />
                                <Field
                                    name="finish"
                                    label="Finish"
                                    options={finishDropdownOptions}
                                    component={FormikSelectField}
                                />
                            </Form.Group>
                            <Form.Group widths="4">
                                <Field
                                    name="colorsArray"
                                    label="Colors"
                                    options={sortByColorDropdownOptions}
                                    component={FormikSelectField}
                                    multiple
                                />
                                <Field
                                    name="colorSpecificity"
                                    label="Color specificity"
                                    options={colorSpecificityDropdownOptions}
                                    component={FormikSelectField}
                                />
                                <Field
                                    name="typeLine"
                                    label="Type Line"
                                    options={typeLineOptions}
                                    component={FormikSelectField}
                                />
                                <Field
                                    name="frame"
                                    label="Frame Effects"
                                    options={frameOptions}
                                    component={FormikSelectField}
                                />
                                <Form.Field>
                                    <label>Price Filter</label>
                                    <Input
                                        label={
                                            <Field
                                                name="priceOperator"
                                                options={
                                                    priceOperatorDropdownOptions
                                                }
                                                component={FormikDropdown}
                                                defaultValue="gte"
                                            />
                                        }
                                        placeholder="Enter a price"
                                        labelPosition="left"
                                        name="price"
                                        type="number"
                                        onChange={handleChange}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <h3>{'Sort & Order'}</h3>
                            <Form.Group>
                                <Field
                                    name="sortBy"
                                    label="Sort by"
                                    options={sortByDropdownOptions}
                                    component={FormikSelectField}
                                    defaultValue={initialFilters.price}
                                />
                                <Field
                                    name="sortByDirection"
                                    label="Order"
                                    options={sortByDirectionDropdownOptions}
                                    component={FormikSelectField}
                                    defaultValue={
                                        initialFilters.sortByDirection
                                    }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Button type="submit" primary>
                                    Submit
                                </Form.Button>
                            </Form.Group>
                        </Form>
                    </FormikForm>
                )}
            </Formik>
        </Segment>
    );
};

export default DeckboxCloneForm;

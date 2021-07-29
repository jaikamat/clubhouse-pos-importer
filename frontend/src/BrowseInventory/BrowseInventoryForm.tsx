import React, { FC, useEffect, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import setNameQuery from './setNameQuery';
import { Filters } from './filteredCardsQuery';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import {
    DropdownOption,
    MUIFormikDropdown,
    MUIFormikMultiSelect,
} from '../ui/FormikDropdown';
import {
    FormControl,
    Grid,
    Paper,
    TextField,
    withStyles,
} from '@material-ui/core';
import Button from '../ui/Button';
import { SectionText } from '../ui/Typography';

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
    { key: 'w', value: 'White', text: 'White' },
    { key: 'u', value: 'Blue', text: 'Blue' },
    { key: 'b', value: 'Black', text: 'Black' },
    { key: 'r', value: 'Red', text: 'Red' },
    { key: 'g', value: 'Green', text: 'Green' },
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
    { key: 'showcase', value: 'showcase', text: 'Showcase' },
];

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

// No validations needed for now
const validate = () => {
    return {};
};

interface Props {
    doSubmit: (v: Filters, page: number) => Promise<void>;
}

const FormContainer = withStyles(({ spacing }) => ({
    root: {
        padding: spacing(2),
    },
}))(Paper);

const BrowseInventoryForm: FC<Props> = ({ doSubmit }) => {
    const [editionDropdownOptions, setEditionDropdownOptions] = useState<
        DropdownOption[]
    >([]);

    const onSubmit = async (
        values: FormValues,
        {}: FormikHelpers<FormValues>
    ) => {
        try {
            await doSubmit(
                {
                    title: values.title || undefined,
                    setName: values.setName || undefined,
                    format: values.format || undefined,
                    price: Number(values.price) || undefined,
                    finish: values.finish || undefined,
                    colors:
                        values.colorsArray.length > 0
                            ? values.colorsArray
                                  .map((c) => {
                                      const colorsMap: Record<
                                          string,
                                          string
                                      > = {
                                          White: 'W',
                                          Blue: 'U',
                                          Black: 'B',
                                          Red: 'R',
                                          Green: 'G',
                                      };

                                      return colorsMap[c];
                                  })
                                  .sort()
                                  .join('')
                            : undefined,
                    colorSpecificity: values.colorSpecificity || undefined,
                    type: values.typeLine || undefined,
                    frame: values.frame || undefined,
                    sortByDirection: values.sortByDirection,
                    priceOperator: values.priceOperator,
                    sortBy: values.sortBy,
                },
                // Always start at page 1 after filtering
                1
            );
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

    const { handleChange, setFieldValue, handleSubmit, values } = useFormik({
        initialValues: initialFilters,
        validate,
        onSubmit,
    });

    return (
        <FormContainer variant="outlined">
            <SectionText>Filters</SectionText>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <ControlledSearchBar
                        value={values.title}
                        onChange={(v) => setFieldValue('title', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="format"
                        label="Format"
                        options={formatDropdownOptions}
                        value={values.format}
                        onChange={(v) => setFieldValue('format', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="setName"
                        label="Edition"
                        options={editionDropdownOptions}
                        value={values.setName}
                        onChange={(v) => setFieldValue('setName', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="finish"
                        label="Finish"
                        options={finishDropdownOptions}
                        value={values.finish}
                        onChange={(v) => setFieldValue('finish', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikMultiSelect
                        name="colorsArray"
                        label="Colors"
                        options={sortByColorDropdownOptions}
                        value={values.colorsArray}
                        onChange={(v) => setFieldValue('colorsArray', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="colorSpecificity"
                        label="Color specificity"
                        options={colorSpecificityDropdownOptions}
                        value={values.colorSpecificity}
                        onChange={(v) => setFieldValue('colorSpecificity', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="typeLine"
                        label="Type Line"
                        options={typeLineOptions}
                        value={values.typeLine}
                        onChange={(v) => setFieldValue('typeLine', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="frame"
                        label="Frame Effects"
                        options={frameOptions}
                        value={values.frame}
                        onChange={(v) => setFieldValue('frame', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="priceOperator"
                        label="Price operator"
                        options={priceOperatorDropdownOptions}
                        value={values.priceOperator}
                        onChange={(v) => setFieldValue('priceOperator', v)}
                        defaultValue="gte"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <TextField
                            label="Price filter"
                            variant="outlined"
                            size="small"
                            placeholder="Enter a price"
                            name="price"
                            type="number"
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <br />
            <SectionText>{'Sort & Order'}</SectionText>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="sortBy"
                        label="Sort by"
                        options={sortByDropdownOptions}
                        defaultValue={initialFilters.price}
                        value={values.sortBy}
                        onChange={(v) => setFieldValue('sortBy', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <MUIFormikDropdown
                        name="sortByDirection"
                        label="Order"
                        options={sortByDirectionDropdownOptions}
                        defaultValue={initialFilters.sortByDirection}
                        value={values.sortByDirection.toString()}
                        onChange={(v) => setFieldValue('sortByDirection', v)}
                    />
                </Grid>
            </Grid>
            <br />
            <Button type="submit" onClick={() => handleSubmit()} primary>
                Submit
            </Button>
        </FormContainer>
    );
};

export default BrowseInventoryForm;

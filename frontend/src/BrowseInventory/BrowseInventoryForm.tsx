import {
    FormControl,
    Grid,
    Paper,
    TextField,
    withStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import Button from '../ui/Button';
import ControlledDropdown, { DropdownOption } from '../ui/ControlledDropdown';
import ControlledMultiSelect from '../ui/ControlledMultiSelect';
import ControlledSearchBar from '../ui/ControlledSearchBar';
import { useToastContext } from '../ui/ToastContext';
import { SectionText } from '../ui/Typography';
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

const finishDropdownOptions: DropdownOption[] = [
    { key: 'nonfoil_foil', value: '', text: 'None' },
    { key: 'nonfoil', value: 'NONFOIL', text: 'Nonfoil' },
    { key: 'foil', value: 'FOIL', text: 'Foil' },
    { key: 'etched', value: 'ETCHED', text: 'Etched' },
];

const sortByDropdownOptions: DropdownOption[] = [
    { key: 'pricesort', value: 'price', text: 'Price' },
    { key: 'alphasort', value: 'name', text: 'Card Name' },
    { key: 'quantitySort', value: 'quantityInStock', text: 'Quantity' },
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
    { key: 'retro', value: 'retro', text: 'Retro' },
];

export interface FormValues {
    title: string;
    setName: string;
    format: string;
    minPrice: string;
    maxPrice: string;
    finish: string;
    colorsArray: string[];
    colorSpecificity: string;
    typeLine: string;
    frame: string;
    sortByDirection: number;
    sortBy: string;
}

export const initialFilters: FormValues = {
    title: '',
    setName: '',
    format: '',
    minPrice: '',
    maxPrice: '',
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
    doSubmit: (v: FormValues, page: number) => Promise<void>;
}

const FormContainer = withStyles(({ spacing }) => ({
    root: {
        padding: spacing(2),
    },
}))(Paper);

const BrowseInventoryForm: FC<Props> = ({ doSubmit }) => {
    const { createErrorToast } = useToastContext();
    const [editionDropdownOptions, setEditionDropdownOptions] = useState<
        DropdownOption[]
    >([]);

    const onSubmit = async (values: FormValues) => {
        try {
            await doSubmit(
                values,
                // Always start at page 1 after filtering
                1
            );
        } catch (err) {
            console.log(err);
            createErrorToast(err);
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
                    <ControlledDropdown
                        name="format"
                        label="Format"
                        options={formatDropdownOptions}
                        value={values.format}
                        onChange={(v) => setFieldValue('format', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledDropdown
                        name="setName"
                        label="Edition"
                        options={editionDropdownOptions}
                        value={values.setName}
                        onChange={(v) => setFieldValue('setName', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledDropdown
                        name="finish"
                        label="Finish"
                        options={finishDropdownOptions}
                        value={values.finish}
                        onChange={(v) => setFieldValue('finish', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledMultiSelect
                        name="colorsArray"
                        label="Colors"
                        options={sortByColorDropdownOptions}
                        value={values.colorsArray}
                        onChange={(v) => setFieldValue('colorsArray', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledDropdown
                        name="colorSpecificity"
                        label="Color specificity"
                        options={colorSpecificityDropdownOptions}
                        value={values.colorSpecificity}
                        onChange={(v) => setFieldValue('colorSpecificity', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledDropdown
                        name="typeLine"
                        label="Type Line"
                        options={typeLineOptions}
                        value={values.typeLine}
                        onChange={(v) => setFieldValue('typeLine', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledDropdown
                        name="frame"
                        label="Frame Effects"
                        options={frameOptions}
                        value={values.frame}
                        onChange={(v) => setFieldValue('frame', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <TextField
                            label="Minimum price"
                            variant="outlined"
                            size="small"
                            placeholder="Enter a price"
                            name="minPrice"
                            type="number"
                            onChange={handleChange}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <TextField
                            label="Maximum price"
                            variant="outlined"
                            size="small"
                            placeholder="Enter a price"
                            name="maxPrice"
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
                    <ControlledDropdown
                        name="sortBy"
                        label="Sort by"
                        options={sortByDropdownOptions}
                        value={values.sortBy}
                        onChange={(v) => setFieldValue('sortBy', v)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ControlledDropdown
                        name="sortByDirection"
                        label="Order"
                        options={sortByDirectionDropdownOptions}
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

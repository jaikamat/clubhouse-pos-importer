import React, { FC, useEffect, useState } from 'react';
import {
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import { useFormik } from 'formik';
import CardImage from '../common/CardImage';
import ControlledDropdown from '../ui/ControlledDropdown';
import IntegerInput from '../ui/IntegerInput';
import { cardConditions } from '../utils/dropdownOptions';
import { BulkCard } from './bulkInventoryQuery';
import BulkSearchBar from './BulkSearchBar';

type Finish = 'FOIL' | 'NONFOIL';
type Condition = 'NM' | 'LP' | 'MP' | 'HP';

interface FormValues {
    bulkCard: BulkCard | null;
    finish: Finish;
    quantity: string;
    condition: Condition;
}

const BulkInventory: FC = () => {
    const [currentCardImage, setCurrentCardImage] = useState<string>('');

    const { values, setFieldValue, handleSubmit } = useFormik<FormValues>({
        initialValues: {
            bulkCard: null,
            finish: 'NONFOIL',
            quantity: '1',
            condition: 'NM',
        },
        onSubmit: async (v: FormValues) => {
            alert(JSON.stringify(v, null, 2));
        },
    });

    useEffect(() => {
        if (values.bulkCard) {
            // Reset condtion when cards change
            setFieldValue('condition', 'NM');

            // Reset quantity when cards change
            setFieldValue('quantity', '1');

            // If _only_ a foil printing exists, set to foil
            if (!values.bulkCard.nonfoil_printing) {
                setFieldValue('finish', 'FOIL');
                return;
            }
            // If _only_ a nonfoil printing exists, set to nonfoil
            if (!values.bulkCard.foil_printing) {
                setFieldValue('finish', 'NONFOIL');
                return;
            }
            // Otherwise both exist, default to nonfoil
            setFieldValue('finish', 'NONFOIL');
        }
    }, [values.bulkCard]);

    return (
        <Container>
            <pre>{JSON.stringify({ values }, null, 2)}</pre>
            <form>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <BulkSearchBar
                            value={values.bulkCard}
                            onChange={(v) => setFieldValue('bulkCard', v)}
                            onHighlight={(o) =>
                                setCurrentCardImage(o?.image || '')
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled={!values.bulkCard}
                        >
                            <InputLabel>Finish</InputLabel>
                            <Select
                                label="Finish"
                                value={values.finish}
                                onChange={(e) =>
                                    setFieldValue(
                                        'finish',
                                        e.target.value as string
                                    )
                                }
                            >
                                <MenuItem
                                    key="nonfoil"
                                    value="FOIL"
                                    disabled={!values?.bulkCard?.foil_printing}
                                >
                                    Foil
                                </MenuItem>
                                <MenuItem
                                    key="foil"
                                    value="NONFOIL"
                                    disabled={
                                        !values?.bulkCard?.nonfoil_printing
                                    }
                                >
                                    Nonfoil
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <ControlledDropdown
                            name="condition"
                            label="Condition"
                            options={cardConditions}
                            value={values.condition}
                            onChange={(v) => setFieldValue('condition', v)}
                        />
                        <IntegerInput
                            label="Quantity"
                            name="quantity"
                            value={values.quantity}
                            onChange={(v) => setFieldValue('quantity', v)}
                        />
                        <div>
                            <CardImage image={currentCardImage} />
                        </div>
                    </Grid>
                </Grid>
                <button onClick={() => handleSubmit()}>Submit!</button>
            </form>
        </Container>
    );
};

export default BulkInventory;

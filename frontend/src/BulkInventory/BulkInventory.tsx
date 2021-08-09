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
import Button from '../ui/Button';

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
    const [submittedCards, setSubmittedCards] = useState<FormValues[]>([]);

    const onSubmit = async (values: FormValues) => {
        alert(JSON.stringify(values, null, 2));
        setSubmittedCards([values, ...submittedCards]);
        resetForm();
    };

    const { values, setFieldValue, handleSubmit, resetForm } = useFormik<
        FormValues
    >({
        initialValues: {
            bulkCard: null,
            finish: 'NONFOIL',
            quantity: '1',
            condition: 'NM',
        },
        onSubmit,
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
            <form>
                <Grid container spacing={2}>
                    <Grid item container spacing={2} xs={8}>
                        <Grid item xs={12}>
                            <BulkSearchBar
                                value={values.bulkCard}
                                onChange={(v) => setFieldValue('bulkCard', v)}
                                onHighlight={(o) =>
                                    setCurrentCardImage(o?.image || '')
                                }
                            />
                        </Grid>
                        <Grid item xs={4}>
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
                                        disabled={
                                            !values.bulkCard?.foil_printing
                                        }
                                    >
                                        Foil
                                    </MenuItem>
                                    <MenuItem
                                        key="foil"
                                        value="NONFOIL"
                                        disabled={
                                            !values.bulkCard?.nonfoil_printing
                                        }
                                    >
                                        Nonfoil
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <ControlledDropdown
                                disabled={!values.bulkCard}
                                name="condition"
                                label="Condition"
                                options={cardConditions}
                                value={values.condition}
                                onChange={(v) => setFieldValue('condition', v)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <IntegerInput
                                label="Quantity"
                                name="quantity"
                                value={values.quantity}
                                onChange={(v) => setFieldValue('quantity', v)}
                                disabled={!values.bulkCard}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                onClick={() => handleSubmit()}
                                disabled={!values.bulkCard}
                            >
                                Submit!
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <div
                            // TODO: Extract this style
                            style={{ maxWidth: 200, height: 'auto' }}
                        >
                            <CardImage image={currentCardImage} />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <pre>{JSON.stringify({ submittedCards }, null, 2)}</pre>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default BulkInventory;

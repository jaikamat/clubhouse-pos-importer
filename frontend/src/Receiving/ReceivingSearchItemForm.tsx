import { Grid } from '@material-ui/core';
import { FormikErrors, FormikHelpers, useFormik } from 'formik';
import { ChangeEvent, FC, useEffect } from 'react';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import { Condition, Finish, Finishes } from '../utils/ClientCard';
import {
    cardConditions,
    createDropdownFinishOptions,
    finishDropdownDisabled,
} from '../utils/dropdownOptions';

interface Props {
    onSubmit: (values: FormValues) => void;
    onFinishSelect: (finish: Finish) => void;
    cardFinishes: Finishes;
}

export interface FormValues {
    quantity: number;
    cashPrice: number;
    creditPrice: number;
    marketPrice: number;
    selectedCondition: Condition;
    selectedFinish: Finish;
}

const validate = ({
    quantity,
    cashPrice,
    creditPrice,
    marketPrice,
    selectedFinish,
    selectedCondition,
}: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    if (!quantity) errors.quantity = 'error';

    if (!cashPrice && !creditPrice) {
        errors.cashPrice = 'error';
        errors.creditPrice = 'error';
    }

    if (cashPrice) {
        // Cards with cash prices must have market prices specified
        if (!marketPrice) errors.marketPrice = 'error';
    }

    if (!selectedFinish) errors.selectedFinish = 'error';
    if (!selectedCondition) errors.selectedCondition = 'error';

    // Cash, credit, and market prices should not be negative
    if (cashPrice < 0) errors.cashPrice = 'Cannot be negative';
    if (creditPrice < 0) errors.creditPrice = 'Cannot be negative';
    if (marketPrice < 0) errors.marketPrice = 'Cannot be negative';

    return errors;
};

const ReceivingSearchItemForm: FC<Props> = ({
    onSubmit,
    onFinishSelect,
    cardFinishes,
}) => {
    const dropdownFinishes = createDropdownFinishOptions(cardFinishes);
    const initialFinish = dropdownFinishes[0].value;

    const initialValues: FormValues = {
        quantity: 1,
        cashPrice: 0,
        creditPrice: 0,
        marketPrice: 0,
        selectedCondition: 'NM',
        selectedFinish: initialFinish,
    };

    const doSubmit = async (
        values: FormValues,
        { resetForm }: FormikHelpers<FormValues>
    ) => {
        await onSubmit(values);
        resetForm(); // Imperatively reset the form after submission
    };

    const { handleSubmit, setFieldValue, values, isValid, handleChange } =
        useFormik({
            initialValues,
            validate,
            onSubmit: doSubmit,
            validateOnMount: true,
        });

    /**
     * On mount, we determine the initial finish and call this so
     * the parent doesn't have to maintain initial state
     */
    useEffect(() => {
        onFinishSelect(initialFinish);
    }, []);

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <TextField
                        type="number"
                        label="Quantity"
                        value={values.quantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const castVal = parseInt(e.target.value);
                            setFieldValue(
                                'quantity',
                                Math.min(castVal < 0 ? 0 : castVal, 50)
                            );
                        }}
                        onFocus={(e) => e.target.select()}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Credit Price"
                        name="creditPrice"
                        type="number"
                        value={values.creditPrice}
                        onChange={handleChange}
                        onFocus={(e) => e.target.select()}
                        inputProps={{
                            step: 0.25,
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Cash Price"
                        name="cashPrice"
                        type="number"
                        value={values.cashPrice}
                        onChange={handleChange}
                        onFocus={(e) => e.target.select()}
                        inputProps={{
                            step: 0.25,
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Market Price"
                        name="marketPrice"
                        type="number"
                        value={values.marketPrice}
                        onChange={handleChange}
                        onFocus={(e) => e.target.select()}
                        disabled={!values.cashPrice}
                        inputProps={{
                            step: 0.25,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <ControlledDropdown
                        name="selectedFinish"
                        label="Finish"
                        options={dropdownFinishes}
                        value={values.selectedFinish}
                        onChange={(v) => {
                            onFinishSelect(v as Finish);
                            setFieldValue('selectedFinish', v);
                        }}
                        disabled={finishDropdownDisabled(cardFinishes)}
                    />
                </Grid>
                <Grid item>
                    <ControlledDropdown
                        name="selectedCondition"
                        label="Condition"
                        options={cardConditions}
                        value={values.selectedCondition}
                        onChange={(v) => {
                            setFieldValue('selectedCondition', v);
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button type="submit" primary disabled={!isValid}>
                        Add to list
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ReceivingSearchItemForm;

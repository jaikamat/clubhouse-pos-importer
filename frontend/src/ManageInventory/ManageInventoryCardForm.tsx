import { Grid } from '@material-ui/core';
import { FormikErrors, FormikHelpers, useFormik } from 'formik';
import React, { ChangeEvent, FC, useEffect } from 'react';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import { Condition, Finish, Finishes } from '../utils/ClientCard';
import {
    cardConditions,
    createDropdownFinishOptions,
    finishDropdownDisabled,
} from '../utils/dropdownOptions';

export interface FormValues {
    selectedFinish: Finish;
    selectedCondition: Condition;
    quantity: string;
}

interface Props {
    onSubmit: (values: FormValues) => void;
    onFinishSelect: (finish: Finish) => void;
    cardFinishes: Finishes;
}

const validate = ({ quantity }: FormValues) => {
    let errors: FormikErrors<FormValues> = {};

    if (!Number(quantity) || !Number.isInteger(+quantity) || +quantity > 100) {
        errors.quantity = 'error';
    }

    return errors;
};

const ManageInventoryCardForm: FC<Props> = ({
    onSubmit,
    onFinishSelect,
    cardFinishes,
}) => {
    const dropdownFinishes = createDropdownFinishOptions(cardFinishes);
    const initialFinish = dropdownFinishes[0].value;

    const initialFormValues: FormValues = {
        selectedFinish: initialFinish,
        selectedCondition: 'NM',
        quantity: '0',
    };

    const doSubmit = async (
        values: FormValues,
        { resetForm }: FormikHelpers<FormValues>
    ) => {
        await onSubmit(values);
        resetForm(); // Imperatively reset the form after submission
    };

    const { values, handleSubmit, setFieldValue, isSubmitting, isValid } =
        useFormik({
            initialValues: initialFormValues,
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
        <form onSubmit={handleSubmit}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <TextField
                        type="number"
                        label="Quantity"
                        value={values.quantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setFieldValue('quantity', e.target.value)
                        }
                        onFocus={() => {
                            if (+values.quantity === 0) {
                                setFieldValue('quantity', '');
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <ControlledDropdown
                        name="finish"
                        label="Finish"
                        value={values.selectedFinish}
                        options={dropdownFinishes}
                        disabled={finishDropdownDisabled(cardFinishes)}
                        onChange={(value) => {
                            onFinishSelect(value as Finish);
                            setFieldValue('selectedFinish', value);
                        }}
                    />
                </Grid>
                <Grid item>
                    <ControlledDropdown
                        name="condition"
                        label="Condition"
                        value={values.selectedCondition}
                        options={cardConditions}
                        onChange={(value) => {
                            setFieldValue('selectedCondition', value);
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button
                        type="submit"
                        primary
                        disabled={!isValid || isSubmitting}
                    >
                        Add to inventory
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ManageInventoryCardForm;

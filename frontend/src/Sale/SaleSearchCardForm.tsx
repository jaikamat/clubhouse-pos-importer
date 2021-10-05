import { Grid } from '@material-ui/core';
import { FormikErrors, useFormik } from 'formik';
import _ from 'lodash';
import React, { ChangeEvent, FC, useEffect } from 'react';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import { Finish, FinishCondition, QOH } from '../utils/ClientCard';

interface ConditionOptions {
    text: string;
    value: keyof QOH;
    key: string;
}

/**
 * Creates a list of conditions for the sales card dropdown menu from the `qoh`
 *
 * TODO: Note - is this not needed if we default select initially?
 */
function createConditionOptions(qoh: QOH, id: string): ConditionOptions[] {
    const removeZeroedQuantites = _.pickBy(qoh, (p) => p && p > 0); // Quantites of zero not included

    return Object.entries(removeZeroedQuantites).map((d) => {
        const [conditionFinish, qty] = d;

        return {
            text: `${conditionFinish.split('_').join(' | ')} | Qty: ${qty}`,
            value: conditionFinish as keyof QOH,
            key: `${id}${conditionFinish}`,
        };
    });
}

function getFinish(fc: FinishCondition) {
    return fc.split('_')[0] as Finish;
}

export interface FormValues {
    quantityToSell: number;
    price: number;
    selectedFinishCondition: keyof QOH;
}

interface Props {
    onSubmit: (values: FormValues) => void;
    onFinishSelect: (finish: Finish) => void;
    cardId: string;
    cardQoh: QOH;
}

const SaleSearchCardForm: FC<Props> = ({
    onSubmit,
    onFinishSelect,
    cardId,
    cardQoh,
}) => {
    const conditionSelectOptions = createConditionOptions(cardQoh, cardId);

    const initialFormValues = {
        selectedFinishCondition: conditionSelectOptions[0].value,
        price: 0,
        quantityToSell: 0,
    };

    const validate = ({
        quantityToSell,
        price,
        selectedFinishCondition: selectedFinish,
    }: FormValues) => {
        const errors: FormikErrors<FormValues> = {};

        if (!quantityToSell) errors.quantityToSell = 'error';
        if (!price) errors.price = 'error';

        if (!selectedFinish) {
            errors.selectedFinishCondition = 'error';
        }

        if (quantityToSell > cardQoh[selectedFinish]!) {
            errors.quantityToSell = 'error';
        }

        if (price < 0) {
            errors.price = 'error';
        }

        if (quantityToSell < 1) {
            errors.quantityToSell = 'error';
        }

        return errors;
    };

    const { handleChange, handleSubmit, setFieldValue, values, isValid } =
        useFormik({
            initialValues: initialFormValues,
            validate,
            onSubmit,
            validateOnMount: true,
        });

    /**
     * On mount, we determine the initial finish and call this so
     * the parent doesn't have to maintain initial state
     */
    useEffect(() => {
        onFinishSelect(getFinish(initialFormValues.selectedFinishCondition));
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <ControlledDropdown
                        name="selectedFinishCondition"
                        label="Select finish/condition"
                        options={conditionSelectOptions}
                        value={values.selectedFinishCondition}
                        onChange={(v) => {
                            onFinishSelect(getFinish(v as FinishCondition));
                            setFieldValue('selectedFinishCondition', v);
                            setFieldValue('quantityToSell', 0);
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        type="number"
                        label="Quantity to sell"
                        value={values.quantityToSell}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const castVal = parseInt(e.target.value);

                            if (
                                castVal >
                                cardQoh[values.selectedFinishCondition]!
                            ) {
                                return;
                            }

                            setFieldValue('quantityToSell', castVal);
                        }}
                        onFocus={(e) => e.target.select()}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={values.price}
                        onChange={handleChange}
                        onFocus={(e) => e.target.select()}
                        inputProps={{
                            step: 0.5,
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button type="submit" primary disabled={!isValid}>
                        Add to sale
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default SaleSearchCardForm;

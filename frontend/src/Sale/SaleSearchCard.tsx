import { Box, Grid } from '@material-ui/core';
import { FormikErrors, useFormik } from 'formik';
import $ from 'jquery';
import _ from 'lodash';
import React, { ChangeEvent, FC, FocusEvent, useContext } from 'react';
import CardImage from '../common/CardImage';
import { SaleContext } from '../context/SaleContext';
import Button from '../ui/Button';
import CardHeader from '../ui/CardHeader';
import CardRowContainer from '../ui/CardRowContainer';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import { ClientCard, Finish, QOH } from '../utils/ClientCard';
import roundPrice from '../utils/roundPrice';

interface ConditionOptions {
    text: string;
    value: keyof QOH;
    key: string;
}

/**
 * Creates a list of conditions for the dropdown menu from the `qoh`
 * Note: Is this not needed if we default select initially?
 * @param {Object} qoh
 * @param {String} id
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

interface FormValues {
    quantityToSell: number;
    price: number;
    selectedFinishCondition: keyof QOH;
}

const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    e.target.select();

interface Props {
    card: ClientCard;
}

const SaleSearchCard: FC<Props> = ({ card }) => {
    const { addToSaleList } = useContext(SaleContext);

    const conditionSelectOptions = createConditionOptions(card.qoh, card.id);

    const onSubmit = ({
        selectedFinishCondition,
        quantityToSell,
        price,
    }: FormValues) => {
        const roundedPrice = roundPrice(price);

        addToSaleList(
            card,
            selectedFinishCondition,
            quantityToSell,
            roundedPrice
        );

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

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

        if (quantityToSell > card.qoh[selectedFinish]!) {
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

    return (
        <CardRowContainer
            image={
                <Box width={100}>
                    <CardImage image={card.cardImage} />
                </Box>
            }
            header={
                <CardHeader
                    card={card}
                    showMid
                    round
                    selectedFinish={
                        values.selectedFinishCondition.split('_')[0] as Finish
                    }
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <ControlledDropdown
                            name="selectedFinishCondition"
                            label="Select finish/condition"
                            options={conditionSelectOptions}
                            value={values.selectedFinishCondition}
                            onChange={(v) => {
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
                                    card.qoh[values.selectedFinishCondition]!
                                ) {
                                    return;
                                }

                                setFieldValue('quantityToSell', castVal);
                            }}
                            onFocus={handleFocus}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={values.price}
                            onChange={handleChange}
                            onFocus={handleFocus}
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
        </CardRowContainer>
    );
};

export default SaleSearchCard;

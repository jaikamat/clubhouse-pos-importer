import { Box, Paper } from '@material-ui/core';
import { FormikErrors, useFormik } from 'formik';
import $ from 'jquery';
import React, { ChangeEvent, FC, FocusEvent, useContext } from 'react';
import CardImage from '../common/CardImage';
import { ReceivingContext } from '../context/ReceivingContext';
import Button from '../ui/Button';
import CardHeader from '../ui/CardHeader';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import { useToastContext } from '../ui/ToastContext';
import checkCardFinish from '../utils/checkCardFinish';
import createFinishCondition from '../utils/createFinishCondtition';
import { cardConditions, finishes } from '../utils/dropdownOptions';
import { Condition, Finish, ScryfallCard } from '../utils/ScryfallCard';

interface Props {
    card: ScryfallCard;
}

interface FormValues {
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

    return errors;
};

const ReceivingSearchItem: FC<Props> = ({ card }) => {
    const createToast = useToastContext();
    const initialValues: FormValues = {
        quantity: 1,
        cashPrice: 0,
        creditPrice: 0,
        marketPrice: 0,
        selectedCondition: 'NM',
        selectedFinish: checkCardFinish(card.nonfoil, card.foil).selectedFinish,
    };

    // Determines whether the select finish dropdown is permanently disabled, seeded from props
    const finishDisabled = checkCardFinish(card.nonfoil, card.foil)
        .finishDisabled;

    const { addToList } = useContext(ReceivingContext);

    const handleFocus = (
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => e.target.select();

    const handleInventoryAdd = ({
        quantity,
        cashPrice,
        creditPrice,
        marketPrice,
        selectedFinish,
        selectedCondition,
    }: FormValues) => {
        if (!quantity) throw new Error('Quantity is missing');

        addToList(quantity, card, {
            cashPrice: cashPrice || 0,
            marketPrice: marketPrice || 0,
            creditPrice: creditPrice || 0,
            finishCondition: createFinishCondition(
                selectedFinish,
                selectedCondition
            ),
        });

        createToast({
            severity: 'success',
            message: `${quantity}x ${card.name} added to buylist!`,
        });

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    const {
        handleSubmit,
        setFieldValue,
        values,
        isValid,
        handleChange,
    } = useFormik({
        initialValues,
        validate,
        onSubmit: (v, { resetForm }) => {
            handleInventoryAdd(v);
            resetForm();
        },
        validateOnMount: true,
    });

    const { cardImage } = card;

    return (
        <Paper variant="outlined">
            <Box p={2}>
                <Box width={100}>
                    <CardImage image={cardImage} />
                </Box>
                <CardHeader
                    card={card}
                    selectedFinish={values.selectedFinish}
                    showMid
                />
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
                <TextField
                    label="Credit Price"
                    name="creditPrice"
                    type="number"
                    value={values.creditPrice}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    inputProps={{
                        step: 0.25,
                    }}
                />
                <TextField
                    label="Cash Price"
                    name="cashPrice"
                    type="number"
                    value={values.cashPrice}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    inputProps={{
                        step: 0.25,
                    }}
                />
                <TextField
                    label="Market Price"
                    name="marketPrice"
                    type="number"
                    value={values.marketPrice}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    disabled={!values.cashPrice}
                    inputProps={{
                        step: 0.25,
                    }}
                />
                <ControlledDropdown
                    name="selectedFinish"
                    label="Finish"
                    options={finishes}
                    value={values.selectedFinish}
                    onChange={(v) => {
                        setFieldValue('selectedFinish', v);
                    }}
                    disabled={finishDisabled}
                />
                <ControlledDropdown
                    name="selectedCondition"
                    label="Condition"
                    options={cardConditions}
                    value={values.selectedCondition}
                    onChange={(v) => {
                        setFieldValue('selectedCondition', v);
                    }}
                />
                <Button
                    primary
                    disabled={!isValid}
                    onClick={() => handleSubmit()}
                >
                    Add to list
                </Button>
            </Box>
        </Paper>
    );
};

export default ReceivingSearchItem;

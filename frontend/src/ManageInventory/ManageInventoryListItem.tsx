import { Box, Grid } from '@material-ui/core';
import { FormikErrors, FormikHelpers, useFormik } from 'formik';
import $ from 'jquery';
import React, { ChangeEvent, FC, useContext, useState } from 'react';
import CardImage from '../common/CardImage';
import { InventoryContext } from '../context/InventoryContext';
import Button from '../ui/Button';
import CardHeader from '../ui/CardHeader';
import CardRowContainer from '../ui/CardRowContainer';
import ControlledDropdown from '../ui/ControlledDropdown';
import TextField from '../ui/TextField';
import { useToastContext } from '../ui/ToastContext';
import checkCardFinish from '../utils/checkCardFinish';
import createFinishCondition from '../utils/createFinishCondtition';
import { cardConditions, dropdownFinishes } from '../utils/dropdownOptions';
import { Condition, Finish, ScryfallCard } from '../utils/ScryfallCard';
import addCardToInventoryQuery from './addCardToInventoryQuery';

interface Props {
    card: ScryfallCard;
}

interface FormValues {
    selectedFinish: Finish;
    selectedCondition: Condition;
    quantity: string;
}

const validate = ({ quantity }: FormValues) => {
    let errors: FormikErrors<FormValues> = {};

    if (!Number(quantity) || !Number.isInteger(+quantity) || +quantity > 100) {
        errors.quantity = 'error';
    }

    return errors;
};

const ManageInventoryListItem: FC<Props> = ({ card }) => {
    const createToast = useToastContext();
    const { finishes, name, set_name, set, id, cardImage } = card;

    const [selectedFinish, setSelectedFinish] = useState<Finish>(
        checkCardFinish(finishes).selectedFinish
    );

    const { changeCardQuantity } = useContext(InventoryContext);

    const initialFormValues: FormValues = {
        selectedFinish: checkCardFinish(finishes).selectedFinish,
        selectedCondition: 'NM',
        quantity: '0',
    };

    const onSubmit = async (
        { quantity, selectedFinish, selectedCondition }: FormValues,
        { resetForm }: FormikHelpers<FormValues>
    ) => {
        try {
            const { qoh } = await addCardToInventoryQuery({
                quantity: parseInt(quantity, 10),
                finishCondition: createFinishCondition(
                    selectedFinish,
                    selectedCondition
                ),
                cardInfo: { id, name, set_name, set },
            });

            // Imperatively reset the form using Formik actions
            resetForm();

            changeCardQuantity(id, qoh);

            createToast({
                severity: 'success',
                message: `${quantity}x ${name} ${
                    parseInt(quantity, 10) > 0 ? 'added' : 'removed'
                }!`,
            });

            // Highlight the input after successful card add
            $('#searchBar').focus().select();
        } catch (err) {
            console.log(err);
        }
    };

    const { values, handleSubmit, setFieldValue, isSubmitting, isValid } =
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
                    <CardImage image={cardImage} hover />
                </Box>
            }
            header={
                <CardHeader card={card} selectedFinish={selectedFinish} round />
            }
        >
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
                            disabled={checkCardFinish(finishes).finishDisabled}
                            onChange={(value) => {
                                setSelectedFinish(value as Finish);
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
        </CardRowContainer>
    );
};

export default ManageInventoryListItem;

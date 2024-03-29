import {
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import CardImage from '../common/CardImage';
import addCardToInventoryQuery from '../ManageInventory/addCardToInventoryQuery';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import IntegerInput from '../ui/IntegerInput';
import { useToastContext } from '../ui/ToastContext';
import { SectionText } from '../ui/Typography';
import { Condition, Finish } from '../utils/ClientCard';
import createFinishCondition from '../utils/createFinishCondtition';
import {
    cardConditions,
    createDropdownFinishOptions,
} from '../utils/dropdownOptions';
import { BulkCard } from './bulkInventoryQuery';
import BulkSearchBar from './BulkSearchBar';
import SubmittedCardsTable from './SubmittedCardsTable';

interface FormValues {
    bulkCard: BulkCard | null;
    finish: Finish;
    quantity: string;
    condition: Condition;
}

export type AddedCard = FormValues & { uuid: string };

const BulkInventory: FC = () => {
    const [currentCardImage, setCurrentCardImage] = useState<string>('');
    const [submittedCards, setSubmittedCards] = useState<AddedCard[]>([]);
    const { createToast, createErrorToast } = useToastContext();

    /**
     * Adds a card to inventory
     */
    const onSubmit = async (values: FormValues) => {
        try {
            if (values.bulkCard) {
                await addCardToInventoryQuery({
                    quantity: Number(values.quantity),
                    finishCondition: createFinishCondition(
                        values.finish,
                        values.condition
                    ),
                    cardInfo: {
                        id: values.bulkCard.scryfall_id,
                        name: values.bulkCard.name,
                        set_name: values.bulkCard.set_name,
                        set: values.bulkCard.set_abbreviation,
                    },
                });

                createToast({
                    message: `Added ${values.quantity}x ${values.bulkCard.name} to inventory`,
                    severity: 'success',
                });
            }
            setSubmittedCards([{ ...values, uuid: uuid() }, ...submittedCards]);
            resetForm();
        } catch (err) {
            console.log(err);
            createErrorToast(err);
        }
    };

    /**
     * Removes a card from inventory as well as the array of added cards
     */
    const onRemove = async (values: AddedCard) => {
        try {
            if (values.bulkCard) {
                await addCardToInventoryQuery({
                    quantity: -Number(values.quantity),
                    finishCondition: createFinishCondition(
                        values.finish,
                        values.condition
                    ),
                    cardInfo: {
                        id: values.bulkCard.scryfall_id,
                        name: values.bulkCard.name,
                        set_name: values.bulkCard.set_name,
                        set: values.bulkCard.set_abbreviation,
                    },
                });

                createToast({
                    message: `Removed ${values.quantity}x ${values.bulkCard.name} from inventory`,
                    severity: 'success',
                });
            }

            setSubmittedCards(
                submittedCards.filter((c) => c.uuid !== values.uuid)
            );
        } catch (err) {
            console.log(err);
            createErrorToast(err);
        }
    };

    const { values, setFieldValue, handleSubmit, resetForm, isSubmitting } =
        useFormik<FormValues>({
            initialValues: {
                bulkCard: null,
                finish: 'NONFOIL',
                quantity: '1',
                condition: 'NM',
            },
            onSubmit,
        });

    // Create the list of valid dropdown selections for finishes from card metadata
    const dropdownFinishOptions = values.bulkCard
        ? createDropdownFinishOptions(values.bulkCard.finishes)
        : [];

    useEffect(() => {
        if (values.bulkCard) {
            // Reset condtion when cards change
            setFieldValue('condition', 'NM');

            // Reset quantity when cards change
            setFieldValue('quantity', '1');

            // Reset the currently selected finish to the first valid element
            setFieldValue('finish', dropdownFinishOptions[0].value);
        }
    }, [values.bulkCard]);

    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <form>
                        <Grid container spacing={3} xs={12}>
                            <Grid item xs={12}>
                                <SectionText>Card search</SectionText>
                                <br />
                                <BulkSearchBar
                                    value={values.bulkCard}
                                    onChange={(v) =>
                                        setFieldValue('bulkCard', v)
                                    }
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
                                        {dropdownFinishOptions.map((d) => (
                                            <MenuItem
                                                key={d.key}
                                                value={d.value}
                                            >
                                                {d.text}
                                            </MenuItem>
                                        ))}
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
                                    onChange={(v) =>
                                        setFieldValue('condition', v)
                                    }
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <IntegerInput
                                    label="Quantity"
                                    name="quantity"
                                    value={values.quantity}
                                    onChange={(v) =>
                                        setFieldValue('quantity', v)
                                    }
                                    disabled={!values.bulkCard}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    primary
                                    onClick={() => handleSubmit()}
                                    disabled={!values.bulkCard || isSubmitting}
                                >
                                    Add to inventory
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
                <Grid item xs={4}>
                    <SectionText>Card preview</SectionText>
                    <br />
                    <CardImage source={currentCardImage} width={200} />
                </Grid>
            </Grid>
            {submittedCards.length > 0 && (
                <div>
                    <SectionText>Recently added cards</SectionText>
                    <SubmittedCardsTable
                        cards={submittedCards}
                        onRemove={onRemove}
                    />
                </div>
            )}
        </Container>
    );
};

export default BulkInventory;

import {
    Container,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
} from '@material-ui/core';
import { useFormik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import CardImage from '../common/CardImage';
import addCardToInventoryQuery from '../ManageInventory/addCardToInventoryQuery';
import Button from '../ui/Button';
import ControlledDropdown from '../ui/ControlledDropdown';
import IntegerInput from '../ui/IntegerInput';
import { useToastContext } from '../ui/ToastContext';
import { SectionText } from '../ui/Typography';
import createFinishCondition from '../utils/createFinishCondtition';
import {
    cardConditions,
    createDropdownFinishOptions,
} from '../utils/dropdownOptions';
import { Condition, Finish } from '../utils/ScryfallCard';
import { BulkCard } from './bulkInventoryQuery';
import BulkSearchBar from './BulkSearchBar';
import SubmittedCardsTable from './SubmittedCardsTable';

const useStyles = makeStyles(({ palette }) => ({
    imageContainer: { maxWidth: 200, height: 'auto' },
    placeholderImage: {
        background: `repeating-linear-gradient(
            45deg,
            ${palette.grey[200]},
            ${palette.grey[200]} 10px,
            ${palette.grey[300]} 10px,
            ${palette.grey[300]} 20px
          )`,
        borderRadius: 10,
        height: 280,
        width: 200,
    },
}));

export interface FormValues {
    bulkCard: BulkCard | null;
    finish: Finish;
    quantity: string;
    condition: Condition;
}

const BulkInventory: FC = () => {
    const { imageContainer, placeholderImage } = useStyles();
    const [currentCardImage, setCurrentCardImage] = useState<string>('');
    const [submittedCards, setSubmittedCards] = useState<FormValues[]>([]);
    const createToast = useToastContext();

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
            setSubmittedCards([values, ...submittedCards]);
            resetForm();
        } catch (err) {
            console.log(err);
            createToast({
                message: `Error adding card`,
                severity: 'error',
            });
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
                    {currentCardImage ? (
                        <div className={imageContainer}>
                            <CardImage image={currentCardImage} />
                        </div>
                    ) : (
                        <div className={imageContainer}>
                            <div className={placeholderImage} />
                        </div>
                    )}
                </Grid>
            </Grid>
            {submittedCards.length > 0 && (
                <div>
                    <SectionText>Recently added cards</SectionText>
                    <SubmittedCardsTable cards={submittedCards} />
                </div>
            )}
        </Container>
    );
};

export default BulkInventory;

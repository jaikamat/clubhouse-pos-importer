import React, { useContext, FC, ChangeEvent } from 'react';
import $ from 'jquery';
import { Segment, Input, Button, Form, Item } from 'semantic-ui-react';
import CardImage from '../common/CardImage';
import createToast from '../common/createToast';
import { ReceivingContext } from '../context/ReceivingContext';
import { finishes, cardConditions } from '../utils/dropdownOptions';
import checkCardFinish, { Finish } from '../utils/checkCardFinish';
import { ScryfallCard } from '../utils/ScryfallCard';
import CardHeader from '../ui/CardHeader';
import { FormikErrors, useFormik } from 'formik';
import FormikSelectField from '../ui/FormikSelectField';

interface Props {
    card: ScryfallCard;
}

type Condition = 'NM' | 'LP' | 'MP' | 'HP';

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

    const handleFocus = (e: ChangeEvent<HTMLInputElement>) => e.target.select();

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
            finishCondition: `${selectedFinish}_${selectedCondition}`, // ex. NONFOIL_NM
        });

        createToast({
            color: 'green',
            header: `${quantity}x ${card.name} added to buylist!`,
            duration: 2000,
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
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="small">
                        <CardImage image={cardImage} />
                    </Item.Image>
                    <Item.Content>
                        <CardHeader
                            card={card}
                            selectedFinish={values.selectedFinish}
                            showMid
                        />
                        <Item.Description>
                            <Form>
                                <Form.Group widths="equal">
                                    <Form.Field
                                        fluid
                                        control={Input}
                                        type="number"
                                        label="Quantity"
                                        value={values.quantity}
                                        onChange={(
                                            _: any,
                                            { value }: { value: string }
                                        ) => {
                                            const castVal = parseInt(value);
                                            setFieldValue(
                                                'quantity',
                                                Math.min(
                                                    castVal < 0 ? 0 : castVal,
                                                    50
                                                )
                                            );
                                        }}
                                        onFocus={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => e.target.select()}
                                    />
                                    <Form.Field
                                        fluid
                                        label="Credit Price"
                                        name="creditPrice"
                                        control={Input}
                                        type="number"
                                        value={values.creditPrice}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                    />
                                    <Form.Field
                                        fluid
                                        label="Cash Price"
                                        name="cashPrice"
                                        control={Input}
                                        type="number"
                                        value={values.cashPrice}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                    />
                                    <Form.Field
                                        fluid
                                        label="Market Price"
                                        name="marketPrice"
                                        control={Input}
                                        type="number"
                                        value={values.marketPrice}
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                        disabled={!values.cashPrice}
                                    />
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <FormikSelectField
                                        label="Finish"
                                        name="selectedFinish"
                                        options={finishes}
                                        defaultValue={
                                            initialValues.selectedFinish
                                        }
                                        onChange={(v) => {
                                            setFieldValue('selectedFinish', v);
                                        }}
                                        disabled={finishDisabled}
                                    />
                                    <FormikSelectField
                                        label="Condition"
                                        name="selectedCondition"
                                        options={cardConditions}
                                        defaultValue={
                                            initialValues.selectedCondition
                                        }
                                        onChange={(v) => {
                                            setFieldValue(
                                                'selectedCondition',
                                                v
                                            );
                                        }}
                                    />
                                    <Form.Button
                                        type="submit"
                                        label="Add to List?"
                                        control={Button}
                                        primary
                                        disabled={!isValid}
                                        onClick={() => handleSubmit()}
                                    >
                                        Add
                                    </Form.Button>
                                </Form.Group>
                            </Form>
                        </Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    );
};

export default ReceivingSearchItem;

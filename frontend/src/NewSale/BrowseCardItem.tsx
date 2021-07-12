import React, { useContext, FC, ChangeEvent } from 'react';
import { Segment, Form, Input, Button, Item } from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'lodash';
import CardImage from '../common/CardImage';
import { SaleContext } from '../context/SaleContext';
import { ScryfallCard, QOH } from '../utils/ScryfallCard';
import CardHeader from '../ui/CardHeader';
import { FormikErrors, useFormik } from 'formik';
import FormikSelectField from '../ui/FormikSelectField';

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
function createConditionOptions(
    qoh: Partial<QOH>,
    id: string
): ConditionOptions[] {
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

type Finish = 'FOIL' | 'NONFOIL';

interface FormValues {
    quantityToSell: number;
    price: number;
    selectedFinishCondition: keyof QOH;
}

interface Props {
    card: ScryfallCard;
}

const BrowseCardItem: FC<Props> = ({ card }) => {
    const { addToSaleList } = useContext(SaleContext);

    const conditionSelectOptions = createConditionOptions(card.qoh, card.id);

    const handleAddToSale = ({
        selectedFinishCondition,
        quantityToSell,
        price,
    }: FormValues) => {
        addToSaleList(card, selectedFinishCondition, quantityToSell, price);

        // TODO: Clear whole sale context state when a sate completes

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

    const { handleSubmit, setFieldValue, values, isValid } = useFormik({
        initialValues: initialFormValues,
        validate,
        onSubmit: handleAddToSale,
        validateOnMount: true,
    });

    return (
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="tiny">
                        <CardImage image={card.cardImage} />
                    </Item.Image>
                    <Item.Content>
                        <CardHeader
                            card={card}
                            selectedFinish={
                                values.selectedFinishCondition.split(
                                    '_'
                                )[0] as Finish
                            }
                            showMid
                            round
                        />
                        <Item.Description>
                            <pre>{JSON.stringify({ values }, null, 2)}</pre>
                            <Form>
                                <Form.Group>
                                    <FormikSelectField
                                        label="Select finish/condition"
                                        name="selectedFinishCondition"
                                        options={conditionSelectOptions}
                                        defaultValue={
                                            initialFormValues.selectedFinishCondition
                                        }
                                        onChange={(v) => {
                                            setFieldValue(
                                                'selectedFinishCondition',
                                                v
                                            );
                                            setFieldValue('quantityToSell', 0);
                                        }}
                                    />
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity to sell"
                                        value={values.quantityToSell}
                                        onChange={(
                                            _: any,
                                            { value }: { value: string }
                                        ) => {
                                            const castVal = parseInt(value, 10);

                                            if (
                                                castVal >
                                                card.qoh[
                                                    values
                                                        .selectedFinishCondition
                                                ]!
                                            ) {
                                                return;
                                            }

                                            setFieldValue(
                                                'quantityToSell',
                                                castVal
                                            );
                                        }}
                                        onFocus={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => e.target.select()}
                                    />
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Price"
                                        value={values.price}
                                        onChange={(
                                            _: any,
                                            { value }: { value: string }
                                        ) => {
                                            const castVal = parseFloat(value);
                                            setFieldValue('price', castVal);
                                        }}
                                        onFocus={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => e.target.select()}
                                        step={0.5}
                                    />
                                    <Form.Button
                                        type="submit"
                                        label="Add to sale?"
                                        control={Button}
                                        primary
                                        onClick={() => handleSubmit()}
                                        disabled={!isValid}
                                    >
                                        Sell
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

export default BrowseCardItem;

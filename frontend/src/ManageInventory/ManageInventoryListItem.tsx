import React, { FC, useContext, useState } from 'react';
import { Segment, Input, Button, Form, Select, Item } from 'semantic-ui-react';
import $ from 'jquery';
import { FormikErrors, FormikHelpers, useFormik } from 'formik';
import createToast from '../common/createToast';
import CardImage from '../common/CardImage';
import { finishes, cardConditions } from '../utils/dropdownOptions';
import checkCardFinish from '../utils/checkCardFinish';
import { InventoryContext } from '../context/InventoryContext';
import { ScryfallCard } from '../utils/ScryfallCard';
import CardHeader from '../ui/CardHeader';
import addCardToInventoryQuery from './addCardToInventoryQuery';

interface Props {
    card: ScryfallCard;
}

interface FormValues {
    selectedFinish: Finish;
    selectedCondition: string;
    quantity: string;
}

type Finish = 'FOIL' | 'NONFOIL';

const validate = ({ quantity }: FormValues) => {
    let errors: FormikErrors<FormValues> = {};

    if (!Number(quantity) || !Number.isInteger(+quantity) || +quantity > 100) {
        errors.quantity = 'error';
    }

    return errors;
};

const ManageInventoryListItem: FC<Props> = ({ card }) => {
    const { foil, nonfoil, name, set_name, set, id, cardImage } = card;

    const [selectedFinish, setSelectedFinish] = useState<Finish>(
        checkCardFinish(nonfoil, foil).selectedFinish
    );

    const { changeCardQuantity } = useContext(InventoryContext);

    const initialFormValues: FormValues = {
        selectedFinish: checkCardFinish(nonfoil, foil).selectedFinish,
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
                finishCondition: `${selectedFinish}_${selectedCondition}`,
                cardInfo: { id, name, set_name, set },
            });

            // Imperatively reset the form using Formik actions
            resetForm();

            changeCardQuantity(id, qoh);

            createToast({
                color: 'green',
                header: `${quantity}x ${name} ${
                    parseInt(quantity, 10) > 0 ? 'added' : 'removed'
                }!`,
                duration: 2000,
            });

            // Highlight the input after successful card add
            $('#searchBar').focus().select();
        } catch (err) {
            console.log(err);
        }
    };

    const {
        values,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        isValid,
    } = useFormik({
        initialValues: initialFormValues,
        validate,
        onSubmit,
        validateOnMount: true,
    });

    return (
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="tiny">
                        <CardImage image={cardImage} hover />
                    </Item.Image>
                    <Item.Content>
                        <CardHeader
                            card={card}
                            selectedFinish={selectedFinish}
                            round
                        />
                        <Item.Description>
                            <Form>
                                <Form.Group>
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity"
                                        value={values.quantity}
                                        onChange={(
                                            _: any,
                                            { value }: { value: number }
                                        ) => setFieldValue('quantity', value)}
                                        onFocus={() => {
                                            if (+values.quantity === 0) {
                                                setFieldValue('quantity', '');
                                            }
                                        }}
                                    />
                                    <Form.Field
                                        label="Finish"
                                        control={Select}
                                        value={values.selectedFinish}
                                        options={finishes}
                                        disabled={
                                            checkCardFinish(nonfoil, foil)
                                                .finishDisabled
                                        }
                                        onChange={(
                                            _: any,
                                            { value }: { value: Finish }
                                        ) => {
                                            setSelectedFinish(value);
                                            setFieldValue(
                                                'selectedFinish',
                                                value
                                            );
                                        }}
                                    />
                                    <Form.Field
                                        label="Condition"
                                        control={Select}
                                        value={values.selectedCondition}
                                        options={cardConditions}
                                        onChange={(
                                            _: any,
                                            { value }: { value: string }
                                        ) =>
                                            setFieldValue(
                                                'selectedCondition',
                                                value
                                            )
                                        }
                                    />
                                    <Form.Button
                                        label="Add to Inventory?"
                                        control={Button}
                                        primary
                                        disabled={!isValid || isSubmitting}
                                        onClick={() => handleSubmit()}
                                        loading={isSubmitting}
                                    >
                                        Submit
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

export default ManageInventoryListItem;

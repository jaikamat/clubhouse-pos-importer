import React, { useState } from 'react';
import {
    Segment,
    Input,
    Button,
    Form,
    Select,
    Label,
    Item,
} from 'semantic-ui-react';
import axios from 'axios';
import $ from 'jquery';
import QohLabels from '../common/QohLabels';
import createToast from '../common/createToast';
import CardImage from '../common/CardImage';
import makeAuthHeader from '../utils/makeAuthHeader';
import MarketPrice from '../common/MarketPrice';
import { ADD_CARD_TO_INVENTORY } from '../utils/api_resources';
import Language from '../common/Language';
import { finishes, cardConditions } from '../common/dropdownOptions';
import { Formik } from 'formik';

/**
 * Seeds state from props. Used to determine if cards have only foil, nonfoil, or both printings
 * from their `foil` and `nonfoil`
 * @param {Boolean} nonfoilProp
 * @param {Boolean} foilProp
 */
function checkCardFinish(nonfoilProp, foilProp) {
    if (!nonfoilProp && foilProp) {
        return { selectedFinish: 'FOIL', finishDisabled: true };
    } else if (nonfoilProp && !foilProp) {
        return { selectedFinish: 'NONFOIL', finishDisabled: true };
    } else if (nonfoilProp && foilProp) {
        return { selectedFinish: 'NONFOIL', finishDisabled: false };
    }
}

export default function ScryfallCardListItem({
    qoh,
    foil,
    nonfoil,
    name,
    set_name,
    set,
    rarity,
    id,
    cardImage,
    lang,
}) {
    const [selectedFinish, setSelectedFinish] = useState(
        checkCardFinish(nonfoil, foil).selectedFinish
    );

    const [inventoryQty, setInventoryQty] = useState(qoh);

    const validate = ({ quantity }) => {
        const errors = {};

        if (
            !Number(quantity) ||
            !Number.isInteger(+quantity) ||
            +quantity > 100
        )
            errors.quantity = 'error';

        return errors;
    };

    const onSubmit = async (
        { quantity, selectedFinish, selectedCondition },
        { resetForm }
    ) => {
        try {
            const { data } = await axios.post(
                ADD_CARD_TO_INVENTORY,
                {
                    quantity: parseInt(quantity, 10),
                    finishCondition: `${selectedFinish}_${selectedCondition}`,
                    cardInfo: { id, name, set_name, set },
                },
                { headers: makeAuthHeader() }
            );

            // Imperatively reset the form using Formik actions
            resetForm();

            // Update the new quantity
            setInventoryQty(data.qoh);

            createToast({
                color: 'green',
                header: `${quantity}x ${name} ${
                    quantity > 0 ? 'added' : 'removed'
                }!`,
                duration: 2000,
            });

            // Highlight the input after successful card add
            $('#searchBar').focus().select();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="tiny">
                        <CardImage image={cardImage} />
                    </Item.Image>
                    <Item.Content>
                        <Item.Header as="h3">
                            {name}{' '}
                            <i
                                className={`ss ss-fw ss-${set} ss-${rarity}`}
                                style={{ fontSize: '30px' }}
                            />
                            <Label color="grey">
                                {set_name} ({String(set).toUpperCase()})
                            </Label>
                            <QohLabels inventoryQty={inventoryQty} />{' '}
                            <MarketPrice id={id} finish={selectedFinish} />
                            <Language languageCode={lang} />
                        </Item.Header>
                        <Item.Description>
                            <Formik
                                initialValues={{
                                    selectedFinish: checkCardFinish(
                                        nonfoil,
                                        foil
                                    ).selectedFinish,
                                    selectedCondition: 'NM',
                                    quantity: 0,
                                }}
                                validate={validate}
                                onSubmit={onSubmit}
                                initialErrors={{ quantity: 'error' }}
                            >
                                {({
                                    values,
                                    handleSubmit,
                                    setFieldValue,
                                    isSubmitting,
                                    isValid,
                                }) => (
                                    <Form>
                                        <Form.Group>
                                            <Form.Field
                                                control={Input}
                                                type="number"
                                                label="Quantity"
                                                value={values.quantity}
                                                onChange={(_, { value }) =>
                                                    setFieldValue(
                                                        'quantity',
                                                        value
                                                    )
                                                }
                                            />
                                            <Form.Field
                                                label="Finish"
                                                control={Select}
                                                value={values.selectedFinish}
                                                options={finishes}
                                                disabled={
                                                    checkCardFinish(
                                                        nonfoil,
                                                        foil
                                                    ).finishDisabled
                                                }
                                                onChange={(_, { value }) => {
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
                                                onChange={(_, { value }) =>
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
                                                disabled={
                                                    !isValid || isSubmitting
                                                }
                                                onClick={handleSubmit}
                                                loading={isSubmitting}
                                            >
                                                Submit
                                            </Form.Button>
                                        </Form.Group>
                                    </Form>
                                )}
                            </Formik>
                        </Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    );
}

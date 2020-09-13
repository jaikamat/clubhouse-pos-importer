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
    const [quantity, setQuantity] = useState(0);
    const [selectedFinish, setSelectedFinish] = useState(
        checkCardFinish(nonfoil, foil).selectedFinish
    );
    const [selectedCondition, setSelectedCondition] = useState('NM');
    const [finishDisabled, setFinishDisabled] = useState(
        checkCardFinish(nonfoil, foil).finishDisabled
    );
    const [submitDisable, setSubmitDisable] = useState(false);
    const [inventoryQty, setInventoryQty] = useState(qoh);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleFinishChange = (e, { value }) => setSelectedFinish(value);

    const handleConditionChange = (e, { value }) => setSelectedCondition(value);

    const handleQuantityChange = (e, { value }) => {
        const val = parseInt(value);
        const quantity = isNaN(val) ? '' : val; // Check for NaN
        setQuantity(quantity);
    };

    // Remove input placeholder when user tries to enter a number (to reduce user error)
    const handleFocus = () => {
        if (quantity === 0) setQuantity('');
    };

    // Restore input placeholder when user blurs field
    const handleBlur = () => {
        if (quantity === '') setQuantity(0);
    };

    const handleInventoryAdd = async (e, { value }) => {
        // This is the identifier for quantities of different finishes/conditions in the db
        const finishCondition = `${selectedFinish}_${selectedCondition}`;

        try {
            setSubmitDisable(true);
            setSubmitLoading(true);

            const { data } = await axios.post(
                ADD_CARD_TO_INVENTORY,
                {
                    quantity: quantity,
                    finishCondition: finishCondition,
                    cardInfo: { id, name, set_name, set },
                },
                { headers: makeAuthHeader() }
            );

            createToast({
                color: 'green',
                header: `${quantity}x ${name} ${
                    quantity > 0 ? 'added' : 'removed'
                }!`,
                duration: 2000,
            });

            setQuantity(0);
            setSelectedFinish(checkCardFinish(nonfoil, foil).selectedFinish);
            setSelectedCondition('NM');
            setFinishDisabled(checkCardFinish(nonfoil, foil).finishDisabled);
            setSubmitDisable(false);
            setSubmitLoading(false);
            setInventoryQty(data.qoh);

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
                            <Form>
                                <Form.Group>
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                    <Form.Field
                                        label="Finish"
                                        control={Select}
                                        value={selectedFinish}
                                        options={finishes}
                                        disabled={finishDisabled}
                                        onChange={handleFinishChange}
                                    />
                                    <Form.Field
                                        label="Condition"
                                        control={Select}
                                        value={selectedCondition}
                                        options={cardConditions}
                                        onChange={handleConditionChange}
                                    />
                                    <Form.Button
                                        label="Add to Inventory?"
                                        control={Button}
                                        primary
                                        disabled={
                                            quantity === 0 ||
                                            quantity === '' ||
                                            submitDisable
                                        }
                                        onClick={handleInventoryAdd}
                                        loading={submitLoading}
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
}

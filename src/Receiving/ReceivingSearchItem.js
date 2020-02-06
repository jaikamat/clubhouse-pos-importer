import React, { useState } from 'react';
import {
    Segment,
    Input,
    Button,
    Form,
    Select,
    Label,
    Item
} from 'semantic-ui-react';
import QohParser from '../QohParser';
import CardImage from '../CardImage';
import MarketPrice from '../MarketPrice'
import $ from 'jquery';
import createToast from '../createToast';

const finishes = [
    { key: 'NONFOIL', text: 'Nonfoil', value: 'NONFOIL' },
    { key: 'FOIL', text: 'Foil', value: 'FOIL' }
];

const cardConditions = [
    { key: 'NM', text: 'Near Mint', value: 'NM' },
    { key: 'LP', text: 'Light Play', value: 'LP' },
    { key: 'MP', text: 'Moderate Play', value: 'MP' },
    { key: 'HP', text: 'Heavy Play', value: 'HP' }
];

/**
 * Seeds state from props. Used to determine if cards have only foil, nonfoil, or both printings
 * from their `foil` and `nonfoil`
 * @param {Boolean} nonfoilProp
 * @param {Boolean} foilProp
 */
function checkCardFinish(nonfoil, foil) {
    if (!nonfoil && foil) {
        return { selectedFinish: 'FOIL', finishDisabled: true };
    } else if (nonfoil && !foil) {
        return { selectedFinish: 'NONFOIL', finishDisabled: true };
    } else if (nonfoil && foil) {
        return { selectedFinish: 'NONFOIL', finishDisabled: false };
    }
}

export default function ReceivingCardItem(props) {
    const [quantity, setQuantity] = useState(1);
    const [cashPrice, setCashPrice] = useState(0);
    const [creditPrice, setCreditPrice] = useState(0);
    const [selectedCondition, setSelectedCondition] = useState('NM');
    const [selectedFinish, setSelectedFinish] = useState(
        checkCardFinish(props.nonfoil, props.foil).selectedFinish // seed state from props
    );

    // Determines whether the select finish dropdown is permanently disabled, seeded from props
    const finishDisabled = checkCardFinish(props.nonfoil, props.foil).finishDisabled;

    const handleFinishChange = (e, { value }) => setSelectedFinish(value);

    const handleConditionChange = (e, { value }) => setSelectedCondition(value);

    const handleCashPriceChange = (e, { value }) => {
        let val = Number(value) || 0;
        if (val < 0) val = 0;
        setCashPrice(val)
    };

    const handleCreditPriceChange = (e, { value }) => {
        let val = Number(value) || 0;
        if (val < 0) val = 0;
        setCreditPrice(val);
    }

    const handleQuantityChange = (e, { value }) => {
        let val = parseInt(value, 10) || 0;
        if (val < 0) val = 0; // cannot receive less than 0
        if (val > 50) val = 50 // set max to 50 cards per single transaction
        setQuantity(val);
    };

    // Select the text when the input is focused, to replace the value (limits user error)
    const handleFocus = e => e.target.select()

    const handleInventoryAdd = () => {
        props.addToList({
            quantity,
            cashPrice,
            creditPrice,
            finishCondition: `${selectedFinish}_${selectedCondition}`, // ex. NONFOIL_NM
            cardInfo: { ...props }
        })

        setQuantity(1);
        setCashPrice(0);
        setCreditPrice(0);
        setSelectedCondition('NM');
        setSelectedFinish(checkCardFinish(props.nonfoil, props.foil).selectedFinish);

        createToast({
            color: 'green',
            header: `${quantity}x ${props.name} added to buylist!`,
            duration: 2000
        });

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    /**
     * Determines whether the `Add` button should be disabled depending on a number of properties
     */
    const submitDisabled = () => {
        const validateQty = quantity === 0 || quantity === '';
        const validateTradeTypes = !cashPrice && !creditPrice;

        return validateQty || validateTradeTypes;
    }

    const {
        image_uris,
        name,
        set_name,
        set,
        rarity,
        card_faces,
        id
    } = props;

    return (
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="small">
                        <CardImage
                            image_uris={image_uris}
                            card_faces={card_faces}
                            hover={false}
                        />
                    </Item.Image>
                    <Item.Content>
                        <Item.Header as='h3'>
                            {name}
                            {' '}
                            <i
                                className={`ss ss-fw ss-${set} ss-${rarity}`}
                                style={{ fontSize: '30px' }}
                            />
                            <Label color="grey">
                                {set_name} ({String(set).toUpperCase()})
                                </Label>
                            <QohParser inventoryQty={props.inventoryQty} />
                            {' '}
                            <MarketPrice id={id} finish={selectedFinish} />
                        </Item.Header>
                        <Item.Description>
                            <Form>
                                <Form.Group widths="12">
                                    <Form.Field
                                        control={Input}
                                        name="quantityInput"
                                        type="number"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onFocus={handleFocus}
                                    />
                                    <Form.Field
                                        label="Credit Price"
                                        name="creditInput"
                                        control={Input}
                                        type="number"
                                        value={creditPrice}
                                        options={cardConditions}
                                        onChange={handleCreditPriceChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                    />
                                    <Form.Field
                                        label="Cash Price"
                                        name="cashInput"
                                        control={Input}
                                        type="number"
                                        value={cashPrice}
                                        options={cardConditions}
                                        onChange={handleCashPriceChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                    />
                                </Form.Group>
                                <Form.Group widths="12">
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
                                        label="Add to List?"
                                        control={Button}
                                        primary
                                        disabled={submitDisabled()}
                                        onClick={handleInventoryAdd}
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
}
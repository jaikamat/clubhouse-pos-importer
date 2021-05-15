import React, { useState, useContext } from 'react';
import $ from 'jquery';
import {
    Segment,
    Input,
    Button,
    Form,
    Select,
    Label,
    Item,
} from 'semantic-ui-react';
import QohLabels from '../common/QohLabels';
import CardImage from '../common/CardImage';
import MarketPrice from '../common/MarketPrice';
import createToast from '../common/createToast';
import { ReceivingContext } from '../context/ReceivingContext';
import Language from '../common/Language';
import { finishes, cardConditions } from '../utils/dropdownOptions';
import checkCardFinish from '../utils/checkCardFinish';

export default function ReceivingSearchItem({ card, qoh }) {
    const [quantity, setQuantity] = useState(1);
    const [cashPrice, setCashPrice] = useState(0);
    const [creditPrice, setCreditPrice] = useState(0);
    const [selectedCondition, setSelectedCondition] = useState('NM');
    const [marketPrice, setMarketPrice] = useState(0);
    const [selectedFinish, setSelectedFinish] = useState(
        checkCardFinish(card.nonfoil, card.foil).selectedFinish // seed state from props
    );

    // Determines whether the select finish dropdown is permanently disabled, seeded from props
    const finishDisabled = checkCardFinish(card.nonfoil, card.foil)
        .finishDisabled;

    const { addToList } = useContext(ReceivingContext);

    const handleFinishChange = (e, { value }) => setSelectedFinish(value);

    const handleConditionChange = (e, { value }) => setSelectedCondition(value);

    // Validates/sanitizes user inputs by tracking the `name` attribute of the input element
    const handlePriceChange = (e, { value }) => {
        let val = Number(value) || 0;
        if (val < 0) val = 0;
        if (value === '') val = '';

        switch (e.target.name) {
            case 'cashInput':
                setCashPrice(val);
                break;
            case 'marketPriceInput':
                setMarketPrice(val);
                break;
            case 'creditInput':
                setCreditPrice(val);
                break;
            default:
                break;
        }
    };

    const handleQuantityChange = (e, { value }) => {
        let val = parseInt(value, 10) || 0;
        if (val < 0) val = 0; // cannot receive less than 0
        if (val > 50) val = 50; // set max to 50 cards per single transaction
        setQuantity(val);
    };

    const handleFocus = (e) => e.target.select();

    const handleInventoryAdd = () => {
        addToList(quantity, {
            ...card,
            cashPrice,
            marketPrice,
            creditPrice,
            finishCondition: `${selectedFinish}_${selectedCondition}`, // ex. NONFOIL_NM
        });

        setQuantity(1);
        setCashPrice(0);
        setMarketPrice(0);
        setCreditPrice(0);
        setSelectedCondition('NM');
        setSelectedFinish(
            checkCardFinish(card.nonfoil, card.foil).selectedFinish
        );

        createToast({
            color: 'green',
            header: `${quantity}x ${card.name} added to buylist!`,
            duration: 2000,
        });

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    /**
     * Determines whether the `Add` button should be disabled
     */
    const submitDisabled = () => {
        const validateQty = quantity === 0 || quantity === '';
        const validateTradeTypes =
            !(cashPrice || creditPrice) ||
            cashPrice === '' ||
            creditPrice === '';
        const validateMarketPrice = marketPrice === 0 || marketPrice === '';

        if (cashPrice > 0) {
            return validateQty || validateTradeTypes || validateMarketPrice;
        }

        return validateQty || validateTradeTypes;
    };

    const {
        image_uris,
        name,
        set_name,
        set,
        rarity,
        card_faces,
        id,
        lang,
    } = card;

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
                        <Item.Header as="h3">
                            {name}{' '}
                            <i
                                className={`ss ss-fw ss-${set} ss-${rarity}`}
                                style={{ fontSize: '30px' }}
                            />
                            <Label color="grey">
                                {set_name} ({String(set).toUpperCase()})
                            </Label>
                            <QohLabels inventoryQty={qoh} />{' '}
                            <MarketPrice id={id} finish={selectedFinish} />
                            <Language languageCode={lang} />
                        </Item.Header>
                        <Item.Description>
                            <Form>
                                <Form.Group widths="12">
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onFocus={(e) => e.target.select()}
                                        className="receiving-quantity"
                                    />
                                    <Form.Field
                                        label="Credit Price"
                                        name="creditInput"
                                        control={Input}
                                        type="number"
                                        value={creditPrice}
                                        onChange={handlePriceChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                        className="receiving-credit"
                                    />
                                    <Form.Field
                                        label="Cash Price"
                                        name="cashInput"
                                        control={Input}
                                        type="number"
                                        value={cashPrice}
                                        onChange={handlePriceChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                        className="receiving-cash"
                                    />
                                    <Form.Field
                                        label="Market Price"
                                        name="marketPriceInput"
                                        control={Input}
                                        type="number"
                                        value={marketPrice}
                                        onChange={handlePriceChange}
                                        onFocus={handleFocus}
                                        step="0.25"
                                        disabled={
                                            cashPrice === 0 || cashPrice === ''
                                        }
                                        className="receiving-market"
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

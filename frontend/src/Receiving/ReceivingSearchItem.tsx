import React, { useState, useContext, FC, ChangeEvent } from 'react';
import $ from 'jquery';
import { Segment, Input, Button, Form, Select, Item } from 'semantic-ui-react';
import CardImage from '../common/CardImage';
import createToast from '../common/createToast';
import { ReceivingContext } from '../context/ReceivingContext';
import { finishes, cardConditions } from '../utils/dropdownOptions';
import checkCardFinish, { Finish } from '../utils/checkCardFinish';
import { InventoryCard } from '../utils/ScryfallCard';
import CardHeader from '../ui/CardHeader';

interface Props {
    card: InventoryCard;
}

const ReceivingSearchItem: FC<Props> = ({ card }) => {
    const [quantity, setQuantity] = useState<number | null>(1);
    const [cashPrice, setCashPrice] = useState<number | null>(0);
    const [creditPrice, setCreditPrice] = useState<number | null>(0);
    const [selectedCondition, setSelectedCondition] = useState<string>('NM');
    const [marketPrice, setMarketPrice] = useState<number | null>(0);
    const [selectedFinish, setSelectedFinish] = useState<Finish>(
        checkCardFinish(card.nonfoil, card.foil).selectedFinish // seed state from props
    );

    // Determines whether the select finish dropdown is permanently disabled, seeded from props
    const finishDisabled = checkCardFinish(card.nonfoil, card.foil)
        .finishDisabled;

    const { addToList } = useContext(ReceivingContext);

    const handleFinishChange = (
        e: ChangeEvent<HTMLInputElement>,
        { value }: { value: Finish }
    ) => setSelectedFinish(value);

    const handleConditionChange = (
        e: ChangeEvent<HTMLInputElement>,
        { value }: { value: string }
    ) => setSelectedCondition(value);

    // Validates/sanitizes user inputs by tracking the `name` attribute of the input element
    const handlePriceChange = (
        e: ChangeEvent<HTMLInputElement>,
        { value }: { value: string }
    ) => {
        let val: number | null = Number(value) || 0;
        if (val < 0) val = 0;
        if (value === '') val = null;

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

    const handleQuantityChange = (
        e: ChangeEvent<HTMLInputElement>,
        { value }: { value: string }
    ) => {
        let val = parseInt(value, 10) || 0;
        if (val < 0) val = 0; // cannot receive less than 0
        if (val > 50) val = 50; // set max to 50 cards per single transaction
        setQuantity(val);
    };

    const handleFocus = (e: ChangeEvent<HTMLInputElement>) => e.target.select();

    const handleInventoryAdd = () => {
        if (quantity) {
            addToList(quantity, card, {
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
        }

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    /**
     * Determines whether the `Add` button should be disabled
     */
    const submitDisabled = () => {
        const validateQty = !quantity;
        const validateTradeTypes = !(cashPrice || creditPrice);
        const validateMarketPrice = !marketPrice;

        if (!!cashPrice) {
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
                            image=""
                        />
                    </Item.Image>
                    <Item.Content>
                        <CardHeader
                            card={card}
                            selectedFinish={selectedFinish}
                        />
                        <Item.Description>
                            <Form>
                                <Form.Group widths="12">
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        onFocus={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => e.target.select()}
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
                                        disabled={cashPrice === 0}
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
};

export default ReceivingSearchItem;

import React, {
    useState,
    useContext,
    FC,
    SyntheticEvent,
    ChangeEvent,
} from 'react';
import {
    Segment,
    Form,
    Input,
    Dropdown,
    Button,
    Item,
} from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'lodash';
import CardImage from '../common/CardImage';
import { SaleContext } from '../context/SaleContext';
import { InventoryCard, QOH } from '../utils/ScryfallCard';
import CardHeader from '../ui/CardHeader';

interface ConditionOptions {
    text: string;
    value: string;
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
            value: conditionFinish,
            key: `${id}${conditionFinish}`,
        };
    });
}

type Finish = 'FOIL' | 'NONFOIL';

/**
 * Creates initial selectedFinish value, used for the MarketPrice component
 * Returns FOIL or NONFOIL depending on what's in current inventory (qoh)
 * @param {Object} qoh
 */
function createInitialSelectedFinish(qoh: Partial<QOH>): Finish {
    const removeZeroedQuantites = _.pickBy(qoh, (p) => p && p > 0);
    // Isolate only the FOIL or NONFOIL values with mapping
    const keysMapped = _.keys(removeZeroedQuantites).map(
        (k) => k.split('_')[0]
    );
    const uniqueValues = _.uniq(keysMapped);
    return uniqueValues.indexOf('NONFOIL') > -1 ? 'NONFOIL' : 'FOIL';
}

interface Props {
    card: InventoryCard;
}

const BrowseCardItem: FC<Props> = ({ card }) => {
    const [selectedFinishCondition, setSelectedFinishCondition] = useState<
        string
    >('');
    const [
        selectedFinishConditionQty,
        setSelectedFinishConditionQty,
    ] = useState<number>(0);
    const [quantityToSell, setQuantityToSell] = useState<number | null>(0);
    const [price, setPrice] = useState<number | null>(0);
    const [selectedFinish, setSelectedFinish] = useState<Finish>(
        createInitialSelectedFinish(card.qoh)
    );
    const [conditionOptions, setConditionOptions] = useState<
        ConditionOptions[]
    >(createConditionOptions(card.qoh, card.id));
    const { addToSaleList } = useContext(SaleContext);

    const handleQuantityChange = (
        e: SyntheticEvent,
        { value }: { value: string }
    ) => {
        if (value === '') {
            setQuantityToSell(null);
            return;
        }

        let numVal = parseInt(value);

        if (numVal > selectedFinishConditionQty)
            numVal = selectedFinishConditionQty;

        if (isNaN(numVal) || numVal < 0) numVal = 0;

        setQuantityToSell(numVal);
    };

    const handleSelectedFinishCondition = (
        e: SyntheticEvent,
        { value }: { value: keyof QOH }
    ) => {
        // TODO: we need to not coerce here
        setSelectedFinish(value.split('_')[0] as Finish);
        setSelectedFinishCondition(value);
        setSelectedFinishConditionQty(card.qoh[value] || 0);
        setQuantityToSell(0);
    };

    const handlePriceChange = (
        e: SyntheticEvent,
        { value }: { value: string }
    ) => {
        if (value === '') {
            setPrice(null);
            return;
        }

        let numVal = Number(value);

        if (isNaN(numVal) || numVal < 0) {
            numVal = 0;
        }

        setPrice(numVal);
    };

    const handleAddToSale = () => {
        const { id } = card;

        addToSaleList(
            card,
            selectedFinishCondition,
            quantityToSell || 0,
            price || 0
        );

        // Reset state
        setSelectedFinishCondition('');
        setSelectedFinishConditionQty(0);
        setQuantityToSell(0);
        setPrice(0);
        setConditionOptions(createConditionOptions(card.qoh, id));
        setSelectedFinish(createInitialSelectedFinish(card.qoh));

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    return (
        <Segment>
            <Item.Group divided>
                <Item>
                    <Item.Image size="tiny">
                        <CardImage
                            image_uris={card.image_uris}
                            card_faces={card.card_faces}
                            image={''}
                            hover={false}
                        />
                    </Item.Image>
                    <Item.Content>
                        <CardHeader
                            card={card}
                            selectedFinish={selectedFinish}
                            showMid
                        />
                        <Item.Description>
                            <Form>
                                <Form.Group>
                                    <Form.Field
                                        className="finish-condition"
                                        control={Dropdown}
                                        selection
                                        placeholder="Select inventory"
                                        options={conditionOptions}
                                        value={selectedFinishCondition}
                                        label="Select finish/condition"
                                        onChange={handleSelectedFinishCondition}
                                    />
                                    <Form.Field
                                        className="sale-qty"
                                        control={Input}
                                        type="number"
                                        label="Quantity to sell"
                                        value={quantityToSell}
                                        onChange={handleQuantityChange}
                                        disabled={!selectedFinishConditionQty}
                                        onFocus={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => e.target.select()}
                                    />
                                    <Form.Field
                                        className="sale-price"
                                        control={Input}
                                        type="number"
                                        label="Price"
                                        value={price}
                                        onChange={handlePriceChange}
                                        disabled={!selectedFinishConditionQty}
                                        onFocus={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => e.target.select()}
                                        step={0.5}
                                    />
                                    <Form.Button
                                        className="add-to-sale"
                                        label="Add to sale?"
                                        control={Button}
                                        primary
                                        onClick={handleAddToSale}
                                        disabled={
                                            !quantityToSell ||
                                            quantityToSell <= 0
                                        }
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

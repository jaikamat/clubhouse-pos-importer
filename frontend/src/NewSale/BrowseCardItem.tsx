import React, {
    useState,
    useContext,
    FC,
    SyntheticEvent,
    ChangeEvent,
} from 'react';
import {
    Segment,
    Label,
    Form,
    Input,
    Dropdown,
    Button,
    Item,
} from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'lodash';
import CardImage from '../common/CardImage';
import MarketPrice from '../common/MarketPrice';
import QohLabels from '../common/QohLabels';
import Language from '../common/Language';
import { SaleContext } from '../context/SaleContext';
import { InventoryCard, QOH } from '../utils/ScryfallCard';

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
function createConditionOptions(qoh: QOH, id: string): ConditionOptions[] {
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
function createInitialSelectedFinish(qoh: QOH): Finish {
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
    qoh: QOH;
}

const BrowseCardItem: FC<Props> = ({ card, qoh }) => {
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
        createInitialSelectedFinish(qoh)
    );
    const [conditionOptions, setConditionOptions] = useState<
        ConditionOptions[]
    >(createConditionOptions(qoh, card.id));
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
        setSelectedFinishConditionQty(qoh[value]);
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
        setConditionOptions(createConditionOptions(qoh, id));
        setSelectedFinish(createInitialSelectedFinish(qoh));

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
                        <Item.Header as="h3">
                            {/* // TODO: displayname */}
                            {card.name}{' '}
                            <i
                                className={`ss ss-fw ss-${card.set} ss-${card.rarity}`}
                                style={{ fontSize: '30px' }}
                            />
                            <Label color="grey">
                                {card.set_name} (
                                {String(card.set).toUpperCase()})
                            </Label>
                            <QohLabels inventoryQty={qoh} />{' '}
                            <MarketPrice
                                id={card.id}
                                finish={selectedFinish}
                                round
                                showMid={false}
                            />
                            <Language languageCode={card.lang} />
                        </Item.Header>
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

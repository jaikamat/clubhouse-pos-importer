import React, { useState, useContext } from 'react';
import { Segment, Label, Form, Input, Dropdown, Button, Item } from 'semantic-ui-react';
import $ from 'jquery';
import _ from 'lodash';
import CardImage from '../common/CardImage';
import MarketPrice from '../common/MarketPrice';
import QohLabels from '../common/QohLabels';
import Language from '../common/Language';
import { SaleContext } from '../context/SaleContext';

/**
 * Creates a list of conditions for the dropdown menu from the `qoh`
 * Note: Is this not needed if we default select initially?
 * @param {Object} qoh
 * @param {String} id
 */
function createConditionOptions(qoh, id) {
    const removeZeroedQuantites = _.pickBy(qoh, p => p > 0); // Quantites of zero not included

    return Object.entries(removeZeroedQuantites).map(d => {
        const [conditionFinish, qty] = d;

        return {
            text: `${conditionFinish.split('_').join(' | ')} | Qty: ${qty}`,
            value: conditionFinish,
            key: `${id}${conditionFinish}`
        };
    });
}

/**
 * Creates initial selectedFinish value, used for the MarketPrice component
 * Returns FOIL or NONFOIL depending on what's in current inventory (qoh)
 * @param {Object} qoh
 */
function createInitialSelectedFinish(qoh) {
    const removeZeroedQuantites = _.pickBy(qoh, p => p > 0);
    // Isolate only the FOIL or NONFOIL values with mapping
    const keysMapped = _.keys(removeZeroedQuantites).map(k => k.split('_')[0]);
    const uniqueValues = _.uniq(keysMapped);
    return uniqueValues.indexOf('NONFOIL') > -1 ? 'NONFOIL' : 'FOIL';
}

export default function BrowseCardItem(props) {
    const [selectedFinishCondition, setSelectedFinishCondition] = useState('');
    const [selectedFinishConditionQty, setSelectedFinishConditionQty] = useState(0);
    const [quantityToSell, setQuantityToSell] = useState(0);
    const [price, setPrice] = useState(0);
    const [selectedFinish, setSelectedFinish] = useState(createInitialSelectedFinish(props.qoh));
    const [conditionOptions, setConditionOptions] = useState(createConditionOptions(props.qoh, props.id));
    const { addToSaleList } = useContext(SaleContext);

    const handleQuantityChange = (e, { value }) => {
        if (value === '') {
            setQuantityToSell('');
            return;
        }

        let numVal = parseInt(value);

        if (numVal > selectedFinishConditionQty) numVal = selectedFinishConditionQty;

        if (isNaN((numVal)) || numVal < 0) numVal = 0;

        setQuantityToSell(numVal);
    };

    const handleSelectedFinishCondition = (e, { value }) => {
        setSelectedFinish(value.split('_')[0]);
        setSelectedFinishCondition(value);
        setSelectedFinishConditionQty(props.qoh[value]);
        setQuantityToSell(0);
    };

    const handlePriceChange = (e, { value }) => {
        if (value === '') {
            setPrice('');
            return;
        }

        let numVal = Number(value);

        if (isNaN((numVal)) || numVal < 0) { numVal = 0; }

        setPrice(numVal);
    };

    const handleAddToSale = () => {
        const { qoh, id } = props;

        addToSaleList(
            { ...props },
            selectedFinishCondition,
            quantityToSell,
            price
        );

        // Reset state
        setSelectedFinishCondition('')
        setSelectedFinishConditionQty(0)
        setQuantityToSell(0)
        setPrice(0)
        setConditionOptions(createConditionOptions(qoh, id))
        setSelectedFinish(createInitialSelectedFinish(qoh))

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    return <Segment>
        <Item.Group divided>
            <Item>
                <Item.Image size="tiny">
                    <CardImage
                        image_uris={props.image_uris}
                        card_faces={props.card_faces}
                    />
                </Item.Image>
                <Item.Content>
                    <Item.Header as="h3">
                        {props.name}{' '}
                        <i
                            className={`ss ss-fw ss-${props.set} ss-${props.rarity}`}
                            style={{ fontSize: '30px' }}
                        />
                        <Label color="grey">
                            {props.set_name} ({String(props.set).toUpperCase()})
                                </Label>
                        <QohLabels inventoryQty={props.qoh} />
                        {' '}
                        <MarketPrice id={props.id} finish={selectedFinish} />
                        <Language languageCode={props.lang} />
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
                                    onFocus={e => e.target.select()}
                                />
                                <Form.Field
                                    className="sale-price"
                                    control={Input}
                                    type="number"
                                    label="Price"
                                    value={price}
                                    onChange={handlePriceChange}
                                    disabled={!selectedFinishConditionQty}
                                    onFocus={e => e.target.select()}
                                    step={0.5}
                                />
                                <Form.Button
                                    className="add-to-sale"
                                    label="Add to sale?"
                                    control={Button}
                                    primary
                                    onClick={handleAddToSale}
                                    disabled={!quantityToSell}
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
}

import React from 'react';
import {
    Segment,
    Label,
    Form,
    Input,
    Dropdown,
    Button,
    Item
} from 'semantic-ui-react';
import CardImage from './CardImage';
import MarketPrice from './MarketPrice';
import QohLabels from './QohLabels';
import $ from 'jquery';
import _ from 'lodash';

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

export default class BrowseCardItem extends React.Component {
    state = {
        selectedFinishCondition: '',
        selectedFinishConditionQty: 0,
        quantityToSell: 0,
        price: 0,
        // Excludes condition ex. `FOIL` rather than `FOIL_NM`. Initialize at nonfoil unless only foil printing
        selectedFinish: createInitialSelectedFinish(this.props.qoh),
        conditionOptions: createConditionOptions(this.props.qoh, this.props.id)
    };

    handleQuantityChange = (e, { value }) => {
        const { selectedFinishConditionQty } = this.state;
        let numVal = parseInt(value);

        if (numVal > selectedFinishConditionQty) {
            numVal = selectedFinishConditionQty;
        }

        if (isNaN((numVal)) || numVal < 0) { numVal = 0; }

        this.setState({ quantityToSell: numVal });
    };

    handleSelectedFinishCondition = (e, { value }) => {
        this.setState({
            selectedFinishCondition: value,
            selectedFinishConditionQty: this.props.qoh[value],
            selectedFinish: value.split('_')[0] // Change selectedFinish after user selection
        });
    };

    handlePriceChange = (e, { value }) => {
        let numVal = Number(value);
        if (isNaN((numVal)) || numVal < 0) { numVal = 0; }
        this.setState({ price: numVal });
    };

    // Remove input placeholder when user tries to enter a number (to reduce user error)
    handleFocus = (property) => {
        if (this.state[property] === 0) {
            this.setState({ [property]: '' })
        }
    }

    // Restore input placeholder when user blurs field
    handleBlur = (property) => {
        if (this.state[property] === '') {
            this.setState({ [property]: 0 })
        }
    }

    handleAddToSale = () => {
        const { selectedFinishCondition, quantityToSell, price } = this.state;
        const { qoh, id } = this.props;

        this.props.addToSaleList(
            { ...this.props },
            selectedFinishCondition,
            quantityToSell,
            price
        );

        // Reset state
        this.setState({
            selectedFinishCondition: '',
            selectedFinishConditionQty: 0,
            quantityToSell: 0,
            price: 0,
            conditionOptions: createConditionOptions(qoh, id),
            selectedFinish: createInitialSelectedFinish(qoh)
        });

        // Highlight the input after successful card add
        $('#searchBar').focus().select();
    };

    render() {
        const {
            name,
            image_uris,
            set,
            set_name,
            rarity,
            qoh,
            id,
            card_faces
        } = this.props;

        const {
            selectedFinishCondition,
            selectedFinishConditionQty,
            selectedFinish,
            conditionOptions,
            quantityToSell,
            price
        } = this.state;

        return (
            <Segment>
                <Item.Group divided>
                    <Item>
                        <Item.Image size="tiny">
                            <CardImage
                                image_uris={image_uris}
                                card_faces={card_faces}
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
                                <QohLabels inventoryQty={qoh} />
                                {' '}
                                <MarketPrice id={id} finish={selectedFinish} />
                            </Item.Header>
                            <Item.Description>
                                <Form>
                                    <Form.Group>
                                        <Form.Field
                                            control={Dropdown}
                                            selection
                                            placeholder="Select inventory"
                                            options={conditionOptions}
                                            value={selectedFinishCondition}
                                            label="Select finish/condition"
                                            onChange={this.handleSelectedFinishCondition}
                                        />
                                        <Form.Field
                                            control={Input}
                                            type="number"
                                            label="Quantity to sell"
                                            value={quantityToSell}
                                            onChange={this.handleQuantityChange}
                                            disabled={!selectedFinishConditionQty}
                                            onFocus={() => this.handleFocus('quantityToSell')}
                                            onBlur={() => this.handleBlur('quantityToSell')}
                                        />
                                        <Form.Field
                                            control={Input}
                                            type="number"
                                            label="Price"
                                            value={price}
                                            onChange={this.handlePriceChange}
                                            disabled={!selectedFinishConditionQty}
                                            onFocus={() => this.handleFocus('price')}
                                            onBlur={() => this.handleBlur('price')}
                                            step={0.5}
                                        />
                                        <Form.Button
                                            label="Add to sale?"
                                            control={Button}
                                            primary
                                            onClick={this.handleAddToSale}
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
        );
    }
}

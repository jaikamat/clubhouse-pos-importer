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
import QohParser from './QohParser';

function createConditionOptions(qoh, id) {
    return Object.entries(qoh).map(d => {
        const [conditionFinish, qty] = d;

        return {
            text: `${removeHyphen(conditionFinish)} | Qty: ${qty}`,
            value: conditionFinish,
            key: `${id}${conditionFinish}`
        };
    });
}

function removeHyphen(str) {
    return str.split('_').join(' | ');
}

export default class BrowseCardItem extends React.Component {
    state = {
        selectedFinishCondition: '',
        selectedFinishConditionQty: 0,
        quantityToSell: 0,
        price: 0,
        conditionOptions: createConditionOptions(this.props.qoh, this.props.id)
    };

    handleQuantityChange = (e, { value }) => {
        const { selectedFinishConditionQty } = this.state;
        if (value > selectedFinishConditionQty) {
            value = selectedFinishConditionQty;
        }
        if (value < 0) value = 0;
        this.setState({ quantityToSell: parseInt(value) });
    };

    handleSelectedFinishCondition = (e, { value }) => {
        this.setState({
            selectedFinishCondition: value,
            selectedFinishConditionQty: this.props.qoh[value]
        });
    };

    handlePriceChange = (e, { value }) => {
        this.setState({
            price: value
        });
    };

    handleAddToSale = () => {
        const { id, name, set } = this.props;
        const { selectedFinishCondition, quantityToSell, price } = this.state;

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
            conditionOptions: createConditionOptions(
                this.props.qoh,
                this.props.id
            )
        });
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
                                <QohParser inventoryQty={qoh} />
                                {' '}
                                <Label tag>
                                    <MarketPrice id={id} />
                                </Label>
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
                                            onChange={
                                                this.handleSelectedFinishCondition
                                            }
                                        />
                                        <Form.Field
                                            control={Input}
                                            type="number"
                                            label="Quantity to sell"
                                            value={quantityToSell}
                                            onChange={this.handleQuantityChange}
                                            disabled={!selectedFinishConditionQty}
                                        />
                                        <Form.Field
                                            control={Input}
                                            type="number"
                                            label="Price"
                                            value={price}
                                            onChange={this.handlePriceChange}
                                            disabled={!selectedFinishConditionQty}
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

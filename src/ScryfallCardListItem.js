import React, { Component } from 'react';
import {
    Segment,
    Input,
    Button,
    Form,
    Select,
    Label,
    Message,
    Item
} from 'semantic-ui-react';
import axios from 'axios';
import QohParser from './QohParser';
import toaster from 'toasted-notes';
import MarketPrice from './MarketPrice';
import CardImage from './CardImage';
import makeAuthHeader from './makeAuthHeader';
import { ADD_CARD_TO_INVENTORY } from './api_resources';

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

// Use this function to seed state from props
function checkCardFinish(nonfoilProp, foilProp) {
    if (!nonfoilProp && foilProp) {
        return { selectedFinish: 'FOIL', finishDisabled: true };
    } else if (nonfoilProp && !foilProp) {
        return { selectedFinish: 'NONFOIL', finishDisabled: true };
    } else if (nonfoilProp && foilProp) {
        return { selectedFinish: 'NONFOIL', finishDisabled: false };
    }
}

export default class ScryfallCardListItem extends Component {
    state = {
        quantity: 0,
        selectedFinish: checkCardFinish(this.props.nonfoil, this.props.foil)
            .selectedFinish,
        selectedCondition: 'NM',
        finishDisabled: checkCardFinish(this.props.nonfoil, this.props.foil)
            .finishDisabled,
        submitDisable: false,
        inventoryQty: this.props.inventoryQty,
        submitLoading: false
    };

    handleFinishChange = (e, { value }) => {
        this.setState({ selectedFinish: value }, () => {
            console.log(this.state);
        });
    };

    handleConditionChange = (e, { value }) => {
        this.setState({ selectedCondition: value }, () => {
            console.log(this.state);
        });
    };

    handleQuantityChange = (e, { value }) => {
        const val = parseInt(value);
        const quantity = isNaN(val) ? '' : val; // Check for NaN
        this.setState({ quantity: quantity });
    };

    handleInventoryAdd = async (e, { value }) => {
        const { quantity, selectedFinish, selectedCondition } = this.state;
        const { name } = this.props;
        // This is the identifier for quantities of different finishes/conditions in the db
        const type = `${selectedFinish}_${selectedCondition}`;

        try {
            this.setState({ submitDisable: true, submitLoading: true });

            const { data } = await axios.post(ADD_CARD_TO_INVENTORY, {
                quantity: quantity,
                type: type,
                cardInfo: { ...this.props },
            }, { headers: makeAuthHeader() });

            const toastjsx = (
                <Message positive compact>
                    <Message.Header>
                        {quantity}x {name} {quantity > 0 ? 'added' : 'removed'}!
                    </Message.Header>
                </Message>
            );

            toaster.notify(() => toastjsx, {
                position: 'bottom-right',
                duration: 2000
            });

            this.setState({
                quantity: 0,
                selectedFinish: checkCardFinish(
                    this.props.nonfoil,
                    this.props.foil
                ).selectedFinish,
                selectedCondition: 'NM',
                finishDisabled: checkCardFinish(
                    this.props.nonfoil,
                    this.props.foil
                ).finishDisabled,
                submitDisable: false,
                inventoryQty: data.qoh,
                submitLoading: false
            });
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        const {
            selectedFinish,
            selectedCondition,
            finishDisabled,
            quantity,
            submitDisable,
            inventoryQty,
            submitLoading
        } = this.state;
        const {
            image_uris,
            name,
            set_name,
            set,
            rarity,
            id,
            card_faces
        } = this.props;

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
                            <Item.Header as='h3'>
                                {name}
                                {' '}
                                <i
                                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                                    style={{ fontSize: '30px' }}
                                />
                                <Label horizontal>
                                    {set_name} ({String(set).toUpperCase()})
                                </Label>
                                <QohParser inventoryQty={inventoryQty} />
                                {' '}
                                <Label horizontal>
                                    <MarketPrice id={id} />
                                </Label>
                            </Item.Header>
                            <Item.Description>
                                <Form>
                                    <Form.Group>
                                        <Form.Field
                                            control={Input}
                                            type="number"
                                            label="Quantity"
                                            value={quantity}
                                            onChange={this.handleQuantityChange}
                                        />
                                        <Form.Field
                                            label="Finish"
                                            control={Select}
                                            value={selectedFinish}
                                            options={finishes}
                                            disabled={finishDisabled}
                                            onChange={this.handleFinishChange}
                                        />
                                        <Form.Field
                                            label="Condition"
                                            control={Select}
                                            value={selectedCondition}
                                            options={cardConditions}
                                            onChange={this.handleConditionChange}
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
                                            onClick={this.handleInventoryAdd}
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
}

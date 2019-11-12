import React, { Component } from 'react';
import { Segment, Image, Input, Button, Form, Select } from 'semantic-ui-react';

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
            .finishDisabled
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
        this.setState({ quantity: value }, () => {
            console.log(this.state);
        });
    };

    render() {
        const {
            selectedFinish,
            selectedCondition,
            finishDisabled,
            quantity
        } = this.state;
        const { image_uris, name, set_name, set, artist } = this.props;

        return (
            <Segment>
                <Image
                    src={image_uris.normal}
                    verticalAlign="middle"
                    size="tiny"
                />
                {name} | {set_name} ({String(set).toUpperCase()}) | {artist}
                <Form>
                    <Form.Group>
                        <Form.Field
                            label="Finish"
                            control={Select}
                            defaultValue={selectedFinish}
                            options={finishes}
                            disabled={finishDisabled}
                            onChange={this.handleFinishChange}
                        />
                        <Form.Field
                            label="Condition"
                            control={Select}
                            defaultValue={selectedCondition}
                            options={cardConditions}
                            onChange={this.handleConditionChange}
                        />
                        <Form.Field
                            control={Input}
                            type="number"
                            label="Quantity"
                            onChange={this.handleQuantityChange}
                        />
                        <Form.Field
                            label="Add to Lightspeed?"
                            control={Button}
                            primary
                            disabled={quantity <= 0}
                        >
                            Submit
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Segment>
        );
    }
}

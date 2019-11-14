import React, { Component } from 'react';
import {
    Segment,
    Image,
    Input,
    Button,
    Form,
    Select,
    Grid,
    Header,
    Label
} from 'semantic-ui-react';
import axios from 'axios';

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
        submitDisable: false
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

    handleInventoryAdd = async (e, { value }) => {
        const { quantity, selectedFinish, selectedCondition } = this.state;

        try {
            this.setState({ submitDisable: true });
            const type = `${selectedFinish}_${selectedCondition}`;
            console.log(quantity, type);
            console.log({ ...this.props });
        } catch (err) {
            console.log(err);
        } finally {
            this.setState({ submitDisable: false });
        }
    };

    render() {
        const {
            selectedFinish,
            selectedCondition,
            finishDisabled,
            quantity,
            submitDisable
        } = this.state;
        const { image_uris, name, set_name, set, rarity } = this.props;

        return (
            <Segment>
                <Grid>
                    <Grid.Column width={2}>
                        <Image src={image_uris.normal} size="tiny" />
                    </Grid.Column>
                    <Grid.Column width={13} verticalAlign="middle">
                        <Grid.Row>
                            <Header as="h3">
                                {name}{' '}
                                <i
                                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                                />
                                <Label horizontal>
                                    {set_name} ({String(set).toUpperCase()})
                                </Label>
                            </Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Form>
                                <Form.Group>
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity"
                                        onChange={this.handleQuantityChange}
                                    />
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
                                        label="Add to Inventory?"
                                        control={Button}
                                        primary
                                        disabled={
                                            quantity <= 0 || submitDisable
                                        }
                                        onClick={this.handleInventoryAdd}
                                    >
                                        Submit
                                    </Form.Field>
                                </Form.Group>
                            </Form>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}

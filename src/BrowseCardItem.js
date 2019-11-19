import React from 'react';
import {
    Grid,
    Image,
    Segment,
    Header,
    Label,
    Form,
    Input,
    Dropdown
} from 'semantic-ui-react';
import QohParser from './QohParser';

function createConditionOptions(qoh) {
    return Object.entries(qoh).map(d => {
        return {
            text: `${removeHyphen(d[0])} | Qty: ${d[1]}`,
            value: d[0]
        };
    });
}

function removeHyphen(str) {
    return str.split('_').join(' | ');
}

export default class BrowseCardItem extends React.Component {
    state = {
        selectedInventory: '',
        quantityToSell: 0,
        conditionOptions: createConditionOptions(this.props.qoh)
    };

    render() {
        const { name, image_uris, set, set_name, rarity, qoh } = this.props;
        const {
            selectedInventory,
            conditionOptions,
            quantityToSell
        } = this.state;

        console.log(conditionOptions);
        return (
            <Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="2">
                            <Image size="tiny" src={image_uris.small} />
                        </Grid.Column>
                        <Grid.Column width="14">
                            <Header as="h3">
                                {name}{' '}
                                <i
                                    className={`ss ss-fw ss-${set} ss-${rarity}`}
                                />
                                <Label horizontal>
                                    {set_name} ({String(set).toUpperCase()})
                                </Label>
                                <QohParser inventoryQty={qoh} />
                            </Header>
                            <Form>
                                <Form.Group>
                                    <Form.Field
                                        control={Dropdown}
                                        selection
                                        placeholder="Select inventory"
                                        options={conditionOptions}
                                        label="Select finish/condition"
                                    />
                                    <Form.Field
                                        control={Input}
                                        type="number"
                                        label="Quantity to sell"
                                        value={quantityToSell}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

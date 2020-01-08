import React from 'react';
import { Button, Icon, Label, Item, Segment } from 'semantic-ui-react';
import Price from './Price';

export default function SaleLineItem(props) {
    const {
        name,
        set,
        // set_name,
        finishCondition,
        qtyToSell,
        price,
        rarity,
        deleteLineItem,
        id
    } = props;

    return (
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Content>
                        <Item.Header as="h4">
                            {name}{' '}
                            <i
                                className={`ss ss-fw ss-${set} ss-${rarity}`}
                                style={{ fontSize: '30px' }}
                            />
                            <Label color="grey">
                                {set.toUpperCase()}
                            </Label>
                        </Item.Header>
                        <Item.Meta>
                            <span>
                                {qtyToSell}x @ <Price num={price} /> | {finishCondition}
                            </span>
                            <Button
                                floated="right"
                                icon
                                onClick={() => deleteLineItem(id, finishCondition)}
                            >
                                <Icon name="cancel"></Icon>
                            </Button>
                        </Item.Meta>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    );
}

import React from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

export default function PrintList(props) {
    const { saleListCards } = props;

    return <React.Fragment>
        {saleListCards.length > 0 &&
            <Modal
                trigger={
                    <Button style={{ display: 'inline-block', float: 'right' }} icon>
                        <Icon name="print" />
                    </Button>}
            >
                <Modal.Header>Sale Pull List</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ul>
                            {saleListCards.map(card => {
                                return <li>{card.name} | x{card.qtyToSell} | {card.finishCondition} | {card.set_name}</li>
                            })}
                        </ul>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => window.print()}>Print me!</Button>
                </Modal.Actions>
            </Modal>
        }
    </React.Fragment>
}
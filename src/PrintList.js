import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default class PrintList extends React.Component {
    state = { printClicked: false }

    print = () => {
        this.setState({ printClicked: true }, () => {
            const content = document.getElementById('print-content');
            const pri = document.getElementById('print-me').contentWindow;

            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();
            this.setState({ printClicked: false });
        });

    }

    render() {
        const { saleListCards } = this.props;

        if (saleListCards.length > 0) { // Ensure print is hidden if no cards in list
            return <React.Fragment>
                {this.state.printClicked ?
                    <iframe title="print-list" id="print-me" style={{ height: '0px', width: '0px', position: 'absolute' }}></iframe> : null
                }

                <Button style={{ display: 'inline-block', float: 'right' }} onClick={this.print} icon>
                    <Icon name="print" />
                </Button>

                <ul id="print-content" style={{ display: 'none' }}>
                    {saleListCards.map(card => {
                        return <li key={card.id}>{card.name} | x{card.qtyToSell} | {card.finishCondition} | {card.set_name}</li>
                    })}
                </ul>

            </React.Fragment >
        } else {
            return null;
        }
    }
}
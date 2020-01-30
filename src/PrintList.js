import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import './PrintList.css';

export default class PrintList extends React.Component {
    state = { printClicked: false }

    print = () => {
        this.setState({ printClicked: true }, () => {
            window.print();
            this.setState({ printClicked: false })
        });
    }

    render() {
        const { saleListCards } = this.props;
        const { printClicked } = this.state;

        if (saleListCards.length > 0) { // Ensure print is hidden if no cards in list
            return (
                <React.Fragment>
                    <Button style={{ display: 'inline-block', float: 'right' }} onClick={this.print} icon>
                        <Icon name="print" />
                    </Button>

                    <div id="printme" style={{ display: printClicked ? 'inline-block' : 'none' }}>
                        <ul>
                            {saleListCards.map(c => <li key={c.id}><b>{c.name} | x{c.qtyToSell} | {c.finishCondition} | {c.set_name}</b></li>)}
                        </ul>
                    </div>
                </React.Fragment>
            )
        } else {
            return null;
        }
    }
}
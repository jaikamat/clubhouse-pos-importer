import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import Price from '../common/Price';
import './PrintList.css';
import SalePriceTotal from './SalePriceTotal';

const Row = ({ id, display_name, qtyToSell, finishCondition, set_name, price }) => {
    return <li key={id}>
        <b>{display_name} | x{qtyToSell} | {finishCondition} | {set_name} | <Price num={price} /></b>
    </li>
}

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
                        <ul>{saleListCards.map(c => Row(c))}</ul>
                        <span><b>Subtotal: <SalePriceTotal saleList={saleListCards} /></b></span>
                    </div>
                </React.Fragment >
            )
        } else {
            return null;
        }
    }
}
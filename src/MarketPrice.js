import React from 'react';
import axios from 'axios';
import Price from './Price';
import makeAuthHeader from './makeAuthHeader';
import { SCRYFALL_ID_SEARCH } from './api_resources';

class MarketPrice extends React.Component {
    state = { price: null };

    async componentDidMount() {
        const { id } = this.props;
        const { data } = await axios.get(`${SCRYFALL_ID_SEARCH}${id}`, { headers: makeAuthHeader() });

        this.setState({ price: Number(data.prices.usd) });
    }

    render() {
        const { price } = this.state;
        return (
            <span>
                Est. {price ? <Price num={price} /> : 'not found'}
            </span>
        );
    }
}

export default MarketPrice;
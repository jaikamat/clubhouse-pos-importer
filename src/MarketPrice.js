import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Price from './Price';
import makeAuthHeader from './makeAuthHeader';
import { SCRYFALL_ID_SEARCH } from './api_resources';
import { Label, Icon } from 'semantic-ui-react';

const foilStyle = {
    backgroundColor: '#ffcfdf',
    backgroundImage: 'linear-gradient(90deg, #ffcfdf 0%, #b0f3f1 74%)'
}

// publicView flags whether this component is on a view that faces customers. Employees should see the raw price
export default function MarketPrice({ id, finish, publicView = false }) {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function fetchData() {
            setLoading(true);
            const { data } = await axios.get(`${SCRYFALL_ID_SEARCH}${id}`, { headers: makeAuthHeader() });
            let finishStatus = 'usd';
            let myPrice;

            if (finish === 'FOIL') finishStatus += '_foil';

            // Public-facing views should show the minimum price for any card as 50 cents
            myPrice = Number(data.prices[finishStatus]);

            if (publicView) {
                setPrice(Math.max(0.5, myPrice))
            } else {
                setPrice(myPrice);
            }

            setLoading(false);
        })();
    }, [id, finish, publicView]);

    return (
        <Label tag style={finish === 'FOIL' ? foilStyle : null}>
            {loading ? <Icon loading name='spinner' /> : <span>Est. {price ? <Price num={price} /> : 'not found'}</span>}
        </Label>
    );
}

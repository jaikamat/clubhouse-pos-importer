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

export default function MarketPrice({ id, finish }) {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async function fetchData() {
            setLoading(true);
            const { data } = await axios.get(`${SCRYFALL_ID_SEARCH}${id}`, { headers: makeAuthHeader() });
            let finishStatus = 'usd';

            if (finish === 'FOIL') finishStatus += '_foil';

            setPrice(Number(data.prices[finishStatus]));
            setLoading(false);
        })();
    }, [id, finish]);

    return (
        <Label tag style={finish === 'FOIL' ? foilStyle : null}>
            {loading ? <Icon loading name='spinner' /> : <span>Est. {price ? <Price num={price} /> : 'not found'}</span>}
        </Label>
    );
}

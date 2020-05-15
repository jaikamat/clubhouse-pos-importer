import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_LIVE_PRICE } from './utils/api_resources';
import { Label, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const LabelStyle = styled(Label)`
    background-color: ${props => !!props.foil ? '#ffcfdf' : null} !important;
    background-image: ${props => !!props.foil ? 'linear-gradient(90deg, #ffcfdf 0%, #b0f3f1 74%)' : null} !important;
`;

export default function MarketPrice({ id, finish }) {
    const [market, setMarket] = useState(null);
    const [median, setMedian] = useState(null);
    const [loading, setLoading] = useState(false);
    const isFoil = finish === 'FOIL';

    useEffect(() => {
        (async function fetchData() {
            setLoading(true);

            const { data } = await axios.get(GET_LIVE_PRICE, {
                params: { scryfallId: id }
            });
            const { marketPrices, medianPrices } = data;
            const MIN_PRICE = 0.5; // Management-set lowest price for each single card

            if (isFoil) {
                setMarket(Math.max(marketPrices.foil, MIN_PRICE));
                setMedian(Math.max(medianPrices.foil, MIN_PRICE));
            } else {
                setMarket(Math.max(marketPrices.normal, MIN_PRICE));
                setMedian(Math.max(medianPrices.normal, MIN_PRICE));
            }

            setLoading(false);
        })();
    }, [id, finish]);

    const loader = <span>Loading <Icon loading name='spinner' /></span>;
    const displayPrice = price => !!price ? `$${price.toFixed(2)}` : 'N/A';

    return <React.Fragment>
        <LabelStyle foil={isFoil}>
            {loading ? loader : <span>Mkt. {displayPrice(market)}</span>}
        </LabelStyle>
        <LabelStyle foil={isFoil}>
            {loading ? loader : <span>Mid. {displayPrice(median)}</span>}
        </LabelStyle>
    </React.Fragment>
}

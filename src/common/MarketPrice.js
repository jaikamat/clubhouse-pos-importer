import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GET_LIVE_PRICE } from '../utils/api_resources';
import { Label, Icon } from 'semantic-ui-react';
import styled from 'styled-components';

const LabelStyle = styled(Label)`
    background-color: ${(props) =>
        !!props.foil ? '#ffcfdf' : null} !important;
    background-image: ${(props) =>
        !!props.foil
            ? 'linear-gradient(90deg, #ffcfdf 0%, #b0f3f1 74%)'
            : null} !important;
`;

// Rounds the passed number to the nearest fifty cents
const roundNearestStep = (num) => Math.ceil(num * 2) / 2;

// Need to be able to turn tcgmarket and tcgmid off
// Need to be able to turn round on and off

export default function MarketPrice({ id, finish, round, showMid = true }) {
    const [market, setMarket] = useState(null);
    const [median, setMedian] = useState(null);
    const [loading, setLoading] = useState(false);
    const isFoil = finish === 'FOIL';

    useEffect(() => {
        (async function fetchData() {
            let _isMounted = true;
            setLoading(true);

            const { data } = await axios.get(GET_LIVE_PRICE, {
                params: { scryfallId: id },
            });
            const { marketPrices, medianPrices } = data;

            if (_isMounted) {
                // Checks to see if the component is not mounted to squelch memory leak warnings
                if (isFoil) {
                    setMarket(Number(marketPrices.foil));
                    setMedian(Number(medianPrices.foil));
                } else {
                    setMarket(Number(marketPrices.normal));
                    setMedian(Number(medianPrices.normal));
                }

                setLoading(false);
            }

            return () => (_isMounted = false);
        })();
    }, [id, finish]);

    const loader = (
        <span>
            Loading <Icon loading name="spinner" />
        </span>
    );
    const displayPrice = (price) => {
        return !!price ? `$${price.toFixed(2)}` : 'N/A';
    };

    return (
        <React.Fragment>
            <LabelStyle foil={isFoil}>
                {loading ? (
                    loader
                ) : (
                    <span>
                        Mkt.{' '}
                        {round
                            ? displayPrice(roundNearestStep(market))
                            : displayPrice(market)}
                    </span>
                )}
            </LabelStyle>
            {showMid && (
                <LabelStyle foil={isFoil}>
                    {loading ? (
                        loader
                    ) : (
                        <span>Mid. {displayPrice(median)}</span>
                    )}
                </LabelStyle>
            )}
        </React.Fragment>
    );
}

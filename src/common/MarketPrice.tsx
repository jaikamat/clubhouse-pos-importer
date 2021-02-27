import React, { useState, useEffect, FC } from 'react';
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

interface Response {
    data: {
        marketPrices: { foil: number; normal: number };
        medianPrices: { foil: number; normal: number };
    };
}

interface Props {
    id: string;
    finish: 'FOIL' | 'NONFOIL';
    round: boolean;
    showMid: boolean;
}

// Rounds the passed number to the nearest fifty cents
const roundNearestStep = (n: number) => Math.ceil(n * 2) / 2;

const displayPrice = (price: number | null) =>
    !!price ? `$${price.toFixed(2)}` : 'N/A';

const MarketPrice: FC<Props> = ({ id, finish, round, showMid = true }) => {
    const [market, setMarket] = useState<number | null>(null);
    const [median, setMedian] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const isFoil = finish === 'FOIL';

    useEffect(() => {
        (async function fetchData() {
            let _isMounted = true;
            setLoading(true);

            const { data }: Response = await axios.get(GET_LIVE_PRICE, {
                params: { scryfallId: id },
            });
            const { marketPrices, medianPrices } = data;

            if (_isMounted) {
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

    return (
        <>
            <LabelStyle foil={isFoil}>
                {loading ? (
                    loader
                ) : (
                    <span>
                        Mkt.{' '}
                        {round
                            ? displayPrice(
                                  market ? roundNearestStep(market) : null
                              )
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
        </>
    );
};

export default MarketPrice;

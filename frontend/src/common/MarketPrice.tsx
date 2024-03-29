import React, { FC, useEffect, useState } from 'react';
import { Finish } from '../utils/ClientCard';
import Chip from './Chip';
import marketPriceQuery from './marketPriceQuery';

interface Props {
    id: string;
    finish: Finish;
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

            const { marketPrices, medianPrices } = await marketPriceQuery({
                scryfallId: id,
            });

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

    const loader = <span>Loading...</span>;

    /**
     * TODO: Remove this once we support etched pricing, and integrate properly
     */
    if (finish === 'ETCHED') {
        return (
            <Chip
                size="small"
                label={loading ? loader : <span>Mkt. N/A</span>}
            />
        );
    }

    return (
        <>
            <Chip
                size="small"
                foil={isFoil}
                label={
                    loading ? (
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
                    )
                }
            />
            {showMid && (
                <Chip
                    size="small"
                    foil={isFoil}
                    label={
                        loading ? (
                            loader
                        ) : (
                            <span>Mid. {displayPrice(median)}</span>
                        )
                    }
                />
            )}
        </>
    );
};

export default MarketPrice;

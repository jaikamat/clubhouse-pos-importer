import React, { FC } from 'react';
import Price from '../common/Price';
import { SaleListCard } from '../context/SaleContext';

interface Props {
    saleList: SaleListCard[];
}

const SalePriceTotal: FC<Props> = ({ saleList }) => {
    const total = saleList.reduce(
        (acc, val) => acc + val.qtyToSell * Number(val.price),
        0
    );

    return (
        <div id="sale-price-total">
            <Price num={total} />
        </div>
    );
};

export default SalePriceTotal;

import React from 'react';
import Price from '../common/Price';

const SalePriceTotal = ({ saleList }) => {
    const total = saleList.length
        ? saleList.reduce(
            (acc, val) => acc + parseInt(val.qtyToSell) * Number(val.price),
            0
        )
        : 0;

    return <div id="sale-price-total"><Price num={total} /></div>
};

export default SalePriceTotal;

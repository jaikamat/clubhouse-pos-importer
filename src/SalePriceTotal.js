import React from 'react';
import Price from './Price';

const SalePriceTotal = ({ saleList }) => {
    const total = saleList.length
        ? saleList.reduce(
              (acc, val) => acc + parseInt(val.qtyToSell) * Number(val.price),
              0
          )
        : 0;

    return <Price num={total} />;
};

export default SalePriceTotal;

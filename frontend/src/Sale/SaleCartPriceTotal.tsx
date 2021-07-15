import React, { FC } from 'react';
import Price from '../common/Price';
import { SaleListCard } from '../context/SaleContext';
import sum from '../utils/sum';

interface Props {
    saleList: SaleListCard[];
}

const SaleCartPriceTotal: FC<Props> = ({ saleList }) => {
    const total = sum(saleList.map((c) => c.qtyToSell * Number(c.price)));

    return (
        <div id="sale-price-total">
            <Price num={total} />
        </div>
    );
};

export default SaleCartPriceTotal;

import React, { FC } from 'react';
import { Price, price } from '../utils/price';

interface Props {
    num: Price;
}

export function getPrice(val: Price) {
    if (val === null) return '$0.00';
    let price: number = typeof val === 'string' ? Number(val) : val;
    if (isNaN(price)) return '$0.00';
    return `$${price.toFixed(2)}`;
}

const DisplayPrice: FC<Props> = ({ num }) => <span>{price(num)}</span>;

export default DisplayPrice;

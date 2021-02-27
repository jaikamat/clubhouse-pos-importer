import React, { FC } from 'react';

interface Props {
    num: number | string;
}

const Price: FC<Props> = ({ num }) => {
    let price: number = typeof num === 'string' ? Number(num) : num;

    if (isNaN(price)) return <span>$0.00</span>;
    return <span>${price.toFixed(2)}</span>;
};

export default Price;

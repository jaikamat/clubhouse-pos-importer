import React from 'react';

const Price = ({ num }) => {
    const price = Number(num).toFixed(2);
    if (isNaN(price)) return <span>$0.00</span>;
    return <span>${price}</span>;
};

export default Price;

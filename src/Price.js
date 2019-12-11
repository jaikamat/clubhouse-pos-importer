import React from 'react';

const Price = ({ num }) => {
    const price = Number(num).toFixed(2);
    return <span>${price}</span>;
};

export default Price;

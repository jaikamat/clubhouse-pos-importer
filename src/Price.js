import React from 'react';

const Price = ({ num }) => {
    const price = Number(num).toFixed(2);
    return <p>${price}</p>;
};

export default Price;

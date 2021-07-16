const roundPrice = (num: number) => {
    return Math.round(num * 1e2) / 1e2;
};

export default roundPrice;

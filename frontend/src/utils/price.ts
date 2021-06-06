export type Price = number | string | null;

export function price(val: Price) {
    if (val === null) return '$0.00';
    let price: number = typeof val === 'string' ? Number(val) : val;
    if (isNaN(price)) return '$0.00';
    return `$${price.toFixed(2)}`;
}

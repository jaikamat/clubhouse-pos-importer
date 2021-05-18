import { getPrice } from './Price';

test('prices', () => {
    expect(getPrice('3.33')).toBe('$3.33');
    expect(getPrice('asdf')).toBe('$0.00');
    expect(getPrice('765.432')).toBe('$765.43');
    expect(getPrice(-765.437)).toBe('$-765.44');
    expect(getPrice('-765.437')).toBe('$-765.44');
    expect(getPrice(null)).toBe('$0.00');
});

import roundPrice from './roundPrice';

test('Round price', () => {
    expect(roundPrice(5.455)).toBe(5.46);
    expect(roundPrice(10)).toBe(10);
    expect(roundPrice(10.3333333)).toBe(10.33);
    expect(roundPrice(4.999)).toBe(5);
});

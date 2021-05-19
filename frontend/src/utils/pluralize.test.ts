import pluralize from './pluralize';

test('plurals', () => {
    expect(pluralize(0, 'card')).toBe('cards');
    expect(pluralize(1, 'card')).toBe('card');
    expect(pluralize(2, 'card')).toBe('cards');
});

import createFinishCondition from './createFinishCondtition';

test('finishCondition', () => {
    expect(createFinishCondition('NONFOIL', 'HP')).toBe('NONFOIL_HP');
    expect(createFinishCondition('NONFOIL', 'LP')).toBe('NONFOIL_LP');
    expect(createFinishCondition('FOIL', 'HP')).toBe('FOIL_HP');
});

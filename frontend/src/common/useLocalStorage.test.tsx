import { act, renderHook } from '@testing-library/react-hooks';
import useLocalStorage from './useLocalStorage';

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

const key = 'foo';

test('useLocalStorage', () => {
    localStorage.setItem(key, 'bar');
    const { result } = renderHook(() => useLocalStorage(key, 'bin'));

    // Ensure proper initialization
    expect(result.current).toStrictEqual(['bin', expect.any(Function)]);

    act(() => {
        const setState = result.current[1]; // retains the same return signature as `useState`
        setState('woo');
    });

    // Ensure changes work
    expect(result.current).toStrictEqual(['woo', expect.any(Function)]);

    act(() => {
        const setState = result.current[1];
        setState(null);
    });

    // Ensure setting to `null` removes the key entirely
    const supposedToBeDeleted = localStorage.getItem(key);
    expect(supposedToBeDeleted).toBeNull();
});

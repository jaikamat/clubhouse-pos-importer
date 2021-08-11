import { useState } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);

            if (item) {
                try {
                    const parsed = JSON.parse(item);
                    return parsed;
                } catch (error) {
                    return initialValue;
                }
            } else {
                return initialValue;
            }
        } catch (err) {
            console.log(err);
            return initialValue;
        }
    });

    const setValue = (value: T | null) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            // Remove entirely if falsy
            if (!valueToStore) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (err) {
            console.log(err);
        }
    };

    return [storedValue, setValue] as const;
};

export default useLocalStorage;

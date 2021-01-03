import React, { createContext, useState } from 'react';

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    const [searchResults, setSearchResults] = useState([]);

    const changeCardQuantity = (id, qoh) => {
        const copiedState = [...searchResults];
        const targetIndex = copiedState.findIndex((e) => e.id === id);
        copiedState[targetIndex].qoh = qoh;
        setSearchResults(copiedState);
    };

    return (
        <InventoryContext.Provider
            value={{ searchResults, setSearchResults, changeCardQuantity }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

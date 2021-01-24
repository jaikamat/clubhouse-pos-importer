import axios from 'axios';
import React, { createContext, useState } from 'react';
import makeAuthHeader from '../utils/makeAuthHeader';
import { InventoryCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';

export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchSelect = async (term) => {
        try {
            const { data } = await axios.get(GET_CARDS_WITH_INFO, {
                params: { title: term, matchInStock: false },
                headers: makeAuthHeader(),
            });

            const modeledData = data.map((c) => new InventoryCard(c));

            setSearchResults(modeledData);
        } catch (e) {
            console.log(e);
        }
    };

    const changeCardQuantity = (id, qoh) => {
        const copiedState = [...searchResults];
        const targetIndex = copiedState.findIndex((e) => e.id === id);
        copiedState[targetIndex].qoh = qoh;
        setSearchResults(copiedState);
    };

    return (
        <InventoryContext.Provider
            value={{ searchResults, changeCardQuantity, handleSearchSelect }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

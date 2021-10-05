import React, { createContext, FC, useContext, useState } from 'react';
import { ClientCard, QOH } from '../utils/ClientCard';
import cardSearchQuery from './cardSearchQuery';

interface Props {}

interface Context {
    searchResults: ClientCard[];
    changeCardQuantity: (id: string, qoh: QOH) => void;
    handleSearchSelect: (term: string) => void;
}

const InventoryContext = createContext<Context>({
    searchResults: [],
    changeCardQuantity: () => null,
    handleSearchSelect: () => null,
});

const InventoryProvider: FC<Props> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<ClientCard[]>([]);

    const handleSearchSelect = async (term: string) => {
        const cards = await cardSearchQuery({
            cardName: term,
            inStockOnly: false,
        });

        setSearchResults(cards);
    };

    const changeCardQuantity = (id: string, qoh: QOH) => {
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
};

export const useInventoryContext = () => useContext(InventoryContext);

export default InventoryProvider;

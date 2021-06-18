import React, { createContext, FC, useState } from 'react';
import { QOH, ScryfallCard } from '../utils/ScryfallCard';
import cardSearchQuery from './cardSearchQuery';

interface Props {}

interface Context {
    searchResults: ScryfallCard[];
    changeCardQuantity: (id: string, qoh: Partial<QOH>) => void;
    handleSearchSelect: (term: string) => void;
}

export const InventoryContext = createContext<Context>({
    searchResults: [],
    changeCardQuantity: () => null,
    handleSearchSelect: () => null,
});

const InventoryProvider: FC<Props> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<ScryfallCard[]>([]);

    const handleSearchSelect = async (term: string) => {
        const cards = await cardSearchQuery({
            cardName: term,
            inStockOnly: false,
        });

        setSearchResults(cards);
    };

    const changeCardQuantity = (id: string, qoh: Partial<QOH>) => {
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

export default InventoryProvider;

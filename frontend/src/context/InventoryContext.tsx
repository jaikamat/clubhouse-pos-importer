import React, { createContext, FC, useState } from 'react';
import { InventoryCard, QOH } from '../utils/ScryfallCard';
import cardSearchQuery from '../common/cardSearchQuery';

interface Props {}

interface Context {
    searchResults: InventoryCard[];
    changeCardQuantity: (id: string, qoh: QOH) => void;
    handleSearchSelect: (term: string) => void;
}

export const InventoryContext = createContext<Context>({
    searchResults: [],
    changeCardQuantity: () => null,
    handleSearchSelect: () => null,
});

const InventoryProvider: FC<Props> = ({ children }) => {
    const [searchResults, setSearchResults] = useState<InventoryCard[]>([]);

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

export default InventoryProvider;

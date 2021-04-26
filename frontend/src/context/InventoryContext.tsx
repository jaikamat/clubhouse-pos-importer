import axios from 'axios';
import React, { createContext, FC, useState } from 'react';
import makeAuthHeader from '../utils/makeAuthHeader';
import { InventoryCard, QOH, ScryfallApiCard } from '../utils/ScryfallCard';
import { GET_CARDS_WITH_INFO } from '../utils/api_resources';

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
        try {
            const { data }: { data: ScryfallApiCard[] } = await axios.get(
                GET_CARDS_WITH_INFO,
                {
                    params: { title: term, matchInStock: false },
                    headers: makeAuthHeader(),
                }
            );

            const modeledData = data.map((c) => new InventoryCard(c));

            setSearchResults(modeledData);
        } catch (e) {
            console.log(e);
        }
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

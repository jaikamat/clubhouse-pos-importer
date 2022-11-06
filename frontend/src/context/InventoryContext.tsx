import { createContext, FC, useContext, useState } from 'react';
import { useToastContext } from '../ui/ToastContext';
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
    const { createErrorToast } = useToastContext();

    const handleSearchSelect = async (term: string) => {
        try {
            const cards = await cardSearchQuery({
                cardName: term,
                inStockOnly: false,
            });

            setSearchResults(cards);
        } catch (err) {
            console.log(err);
            createErrorToast(err);
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

export const useInventoryContext = () => useContext(InventoryContext);

export default InventoryProvider;

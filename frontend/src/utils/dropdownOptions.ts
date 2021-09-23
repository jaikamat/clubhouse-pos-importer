import { Finish, Finishes } from './ScryfallCard';

interface DropdownOption {
    key: string;
    text: string;
    value: Finish;
}

export const dropdownFinishes: DropdownOption[] = [
    { key: 'NONFOIL', text: 'Nonfoil', value: 'NONFOIL' },
    { key: 'FOIL', text: 'Foil', value: 'FOIL' },
    { key: 'ETCHED', text: 'Etched', value: 'ETCHED' },
];

export const finishDropdownDisabled = (finishes: Finishes) => {
    return finishes.length === 1;
};

export const createDropdownFinishOptions = (
    finishes: Finishes
): DropdownOption[] => {
    const output = [];

    if (finishes.includes('nonfoil')) {
        output.push({
            key: 'NONFOIL',
            text: 'Nonfoil',
            value: 'NONFOIL' as const,
        });
    }

    if (finishes.includes('foil')) {
        output.push({
            key: 'FOIL',
            text: 'Foil',
            value: 'FOIL' as const,
        });
    }

    if (finishes.includes('etched')) {
        output.push({
            key: 'ETCHED',
            text: 'Etched',
            value: 'ETCHED' as const,
        });
    }

    return output;
};

export const cardConditions = [
    { key: 'NM', text: 'Near Mint', value: 'NM' },
    { key: 'LP', text: 'Light Play', value: 'LP' },
    { key: 'MP', text: 'Moderate Play', value: 'MP' },
    { key: 'HP', text: 'Heavy Play', value: 'HP' },
];

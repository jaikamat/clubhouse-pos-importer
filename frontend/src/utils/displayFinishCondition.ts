import { QOH } from './ClientCard';

type FinishConditionLabels = Record<keyof QOH, string>;

const displayFinishCondition = (finishCondition: keyof QOH) => {
    const finishConditionLabels: FinishConditionLabels = {
        FOIL_NM: 'Foil (NM)',
        FOIL_LP: 'Foil (LP)',
        FOIL_MP: 'Foil (MP)',
        FOIL_HP: 'Foil (HP)',
        NONFOIL_NM: 'Nonfoil (NM)',
        NONFOIL_LP: 'Nonfoil (LP)',
        NONFOIL_MP: 'Nonfoil (MP)',
        NONFOIL_HP: 'Nonfoil (HP)',
        ETCHED_NM: 'Etched (NM)',
        ETCHED_LP: 'Etched (LP)',
        ETCHED_MP: 'Etched (MP)',
        ETCHED_HP: 'Etched (HP)',
    };

    return finishConditionLabels[finishCondition];
};

export default displayFinishCondition;

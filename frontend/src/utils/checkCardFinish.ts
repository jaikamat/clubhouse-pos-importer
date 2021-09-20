import { Finish, Finishes } from '../utils/ScryfallCard';

interface CardFinishState {
    selectedFinish: Finish;
    finishDisabled: boolean;
}

/**
 * Seeds state from props. Used to determine if cards have only foil, nonfoil, or both printings
 * from their `foil` and `nonfoil` properties
 *
 * @param {Boolean} nonfoilProp
 * @param {Boolean} foilProp
 */
export default function checkCardFinish(finishes: Finishes): CardFinishState {
    const isFoil = finishes.includes('foil');
    const isNonfoil = finishes.includes('nonfoil');

    if (!isNonfoil && isFoil) {
        return { selectedFinish: 'FOIL', finishDisabled: true };
    } else if (isNonfoil && !isFoil) {
        return { selectedFinish: 'NONFOIL', finishDisabled: true };
    } else {
        return { selectedFinish: 'NONFOIL', finishDisabled: false };
    }
}

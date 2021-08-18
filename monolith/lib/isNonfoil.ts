import { FinishCondition } from '../common/types';

/**
 * Returns whether or not a given finishCondition value is nonfoil
 */
const isNonfoil = (val: FinishCondition) => {
    if (val.includes('NONFOIL')) return true;
    else return false;
};

export default isNonfoil;

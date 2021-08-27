import { Condition, Finish } from '../utils/ScryfallCard';

type FinishCondition = `${Finish}_${Condition}`

const createFinishCondition = (
    finish: Finish,
    condition: Condition
): FinishCondition => {
    return `${finish}_${condition}` as FinishCondition;
};

export default createFinishCondition;

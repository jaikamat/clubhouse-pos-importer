import { Condition, Finish, FinishCondition } from './ClientCard';

const createFinishCondition = (
    finish: Finish,
    condition: Condition
): FinishCondition => {
    return `${finish}_${condition}` as FinishCondition;
};

export default createFinishCondition;

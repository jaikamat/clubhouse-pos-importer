/**
 * Seeds state from props. Used to determine if cards have only foil, nonfoil, or both printings
 * from their `foil` and `nonfoil` properties
 *
 * @param {Boolean} nonfoilProp
 * @param {Boolean} foilProp
 */
export default function checkCardFinish(nonfoil: boolean, foil: boolean) {
    if (!nonfoil && foil) {
        return { selectedFinish: 'FOIL', finishDisabled: true };
    } else if (nonfoil && !foil) {
        return { selectedFinish: 'NONFOIL', finishDisabled: true };
    } else if (nonfoil && foil) {
        return { selectedFinish: 'NONFOIL', finishDisabled: false };
    }
}

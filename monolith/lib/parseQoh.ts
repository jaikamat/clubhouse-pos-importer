import { QOH } from '../common/types';

/**
 * This function parses the `qoh` object from mongo into something more presentable
 */
export default function parseQoh(qoh: Partial<QOH>): {
    foilQty: number;
    nonfoilQty: number;
} {
    let foilQty = 0;
    let nonfoilQty = 0;

    foilQty =
        (qoh?.FOIL_NM || 0) +
        (qoh?.FOIL_LP || 0) +
        (qoh?.FOIL_MP || 0) +
        (qoh?.FOIL_HP || 0);

    nonfoilQty =
        (qoh?.NONFOIL_NM || 0) +
        (qoh?.NONFOIL_LP || 0) +
        (qoh?.NONFOIL_MP || 0) +
        (qoh?.NONFOIL_HP || 0);

    return {
        foilQty,
        nonfoilQty,
    };
}

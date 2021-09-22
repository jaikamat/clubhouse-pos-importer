import { QOH } from '../common/types';

/**
 * This function parses the `qoh` object from mongo into something more presentable
 */
export default function parseQoh(qoh: QOH): {
    foilQty: number;
    nonfoilQty: number;
    etchedQty: number;
} {
    let foilQty = 0;
    let nonfoilQty = 0;
    let etchedQty = 0;

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

    etchedQty =
        (qoh?.ETCHED_NM || 0) +
        (qoh?.ETCHED_LP || 0) +
        (qoh?.ETCHED_MP || 0) +
        (qoh?.ETCHED_HP || 0);

    return {
        foilQty,
        nonfoilQty,
        etchedQty,
    };
}

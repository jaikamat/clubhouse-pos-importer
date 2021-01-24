interface QOH {
    FOIL_NM?: number;
    FOIL_LP?: number;
    FOIL_MP?: number;
    FOIL_HP?: number;
    NONFOIL_NM?: number;
    NONFOIL_LP?: number;
    NONFOIL_MP?: number;
    NONFOIL_HP?: number;
}

/**
 * This function parses the `qoh` object from mongo into something more presentable
 */
export default function parseQoh(
    qoh: QOH
): { foilQty: number; nonfoilQty: number } {
    let foilQty = 0;
    let nonfoilQty = 0;

    foilQty =
        (qoh.FOIL_NM || 0) +
        (qoh.FOIL_LP || 0) +
        (qoh.FOIL_MP || 0) +
        (qoh.FOIL_HP || 0);

    nonfoilQty =
        (qoh.NONFOIL_NM || 0) +
        (qoh.NONFOIL_LP || 0) +
        (qoh.NONFOIL_MP || 0) +
        (qoh.NONFOIL_HP || 0);

    return {
        foilQty,
        nonfoilQty,
    };
}

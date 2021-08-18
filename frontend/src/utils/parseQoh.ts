import { QOH } from './ScryfallCard';

export default function parseQoh(qoh: Partial<QOH>) {
    const foilQty =
        (qoh?.FOIL_NM || 0) +
        (qoh?.FOIL_LP || 0) +
        (qoh?.FOIL_MP || 0) +
        (qoh?.FOIL_HP || 0);

    const nonfoilQty =
        (qoh?.NONFOIL_NM || 0) +
        (qoh?.NONFOIL_LP || 0) +
        (qoh?.NONFOIL_MP || 0) +
        (qoh?.NONFOIL_HP || 0);

    return [foilQty, nonfoilQty] as const;
}

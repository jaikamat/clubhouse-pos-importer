import { QOH } from './ScryfallCard';

export default function parseQoh(inventoryQty: QOH): [number, number] {
    let foilQty = 0;
    let nonfoilQty = 0;

    foilQty =
        (inventoryQty.FOIL_NM || 0) +
        (inventoryQty.FOIL_LP || 0) +
        (inventoryQty.FOIL_MP || 0) +
        (inventoryQty.FOIL_HP || 0);

    nonfoilQty =
        (inventoryQty.NONFOIL_NM || 0) +
        (inventoryQty.NONFOIL_LP || 0) +
        (inventoryQty.NONFOIL_MP || 0) +
        (inventoryQty.NONFOIL_HP || 0);

    return [foilQty, nonfoilQty];
}

// This component parses the `qoh` object from mongo into something
// more presentable

// available entries:
// {
//     FOIL_NM: 0,
//     FOIL_LP: 0,
//     FOIL_MP: 0,
//     FOIL_HP: 0,
//     NONFOIL_NM: 0,
//     NONFOIL_LP: 0,
//     NONFOIL_MP: 0,
//     NONFOIL_HP: 0
// };

export default function QohParser({ inventoryQty }) {
    if (!inventoryQty) {
        return `Foil: 0 | Nonfoil: 0`;
    }

    const foilQty =
        (inventoryQty.FOIL_NM || 0) +
        (inventoryQty.FOIL_LP || 0) +
        (inventoryQty.FOIL_MP || 0) +
        (inventoryQty.FOIL_HP || 0);

    const nonfoilQty =
        (inventoryQty.NONFOIL_NM || 0) +
        (inventoryQty.NONFOIL_LP || 0) +
        (inventoryQty.NONFOIL_MP || 0) +
        (inventoryQty.NONFOIL_HP || 0);

    return `Foil: ${foilQty} | Nonfoil: ${nonfoilQty}`;
}

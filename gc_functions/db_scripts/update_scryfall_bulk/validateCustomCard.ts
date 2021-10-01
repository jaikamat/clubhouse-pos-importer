import { Validator } from "./cardValidators";

const customCards = [
    { name: "Crystalline Giant", set: "iko", lang: "ja" },
    { name: "Mina and Denn, Wildborn", set: "ogw", lang: "ja" },
    { name: "Vow of Duty", set: "cmd", lang: "ja" },
    { name: "Utility Knife", set: "znr", lang: "ja" },
    { name: "Armor Sliver", set: "tmp", lang: "ja" },
    { name: "Evacuation", set: "c16", lang: "ja" },
    { name: "Intangible Virtue", set: "isd", lang: "ja" },
    { name: "Izzet Boilerworks", set: "mm2", lang: "ja" },
    { name: "Azorius Chancery", set: "c19", lang: "ja" },
    { name: "Dismal Backwater", set: "frf", lang: "ja" },
    { name: "Yasharn, Implacable Earth", set: "znr", lang: "ja" },
    { name: "Engineered Explosives", set: "2xm", lang: "ja" },
    { name: "Shimmer Myr", set: "cmr", lang: "ja" },
    { name: "Silent Dart", set: "m21", lang: "ja" },
    { name: "Gang of Devils", set: "avr", lang: "ja" },
    { name: "Urabrask the Hidden", set: "ima", lang: "ja" },
    { name: "Mysterious Egg", set: "iko", lang: "ja" },
    { name: "Lonely Sandbar", set: "mh1", lang: "ja" },
    { name: "Soltari Priest", set: "pjjt", lang: "ja" },
    { name: "Numa, Joraga Chieftain", set: "cmr", lang: "ja" },
    { name: "Boros Signet", set: "c20", lang: "ja" },
    { name: "Assassinate", set: "m10", lang: "ja" },
    { name: "Mysterious Egg", set: "iko", lang: "ja" },
    { name: "Island", set: "ddf", lang: "ja" },
    { name: "Justice", set: "5ed", lang: "ja" },
    { name: "Madcap Skills", set: "mm3", lang: "ja" },
    { name: "Cephalid Sage", set: "tor", lang: "ja" },
    { name: "Dragonspeaker Shaman", set: "c17", lang: "ja" },
    { name: "Ghost Council of Orzhova", set: "gpt", lang: "ja" },
    { name: "Blue Elemental Blast", set: "4ed", lang: "ja" },
    { name: "Blossoming Sands", set: "ema", lang: "ja" },
    { name: "Flowstone Shambler", set: "sth", lang: "ja" },
    { name: "Hinterland Drake", set: "aer", lang: "ja" },
    { name: "Buried Ruin", set: "c16", lang: "ja" },
    { name: "Stangg", set: "chr", lang: "ja" },
    { name: "Dirge of Dread", set: "a25", lang: "ja" },
    { name: "Ray of Distortion", set: "ody", lang: "ja" },
    { name: "Dawn to Dusk", set: "bng", lang: "ja" },
    { name: "Thorn Elemental", set: "uds", lang: "ja" },
    { name: "Exotic Orchard", set: "con", lang: "ja" },
    { name: "Ichor Wellspring", set: "2xm", lang: "ja" },
    { name: "Opt", set: "dom", lang: "ja" },
    { name: "Command Tower", set: "c19", lang: "ja" },
    { name: "Enthralling Victor", set: "bbd", lang: "ja" },
    { name: "Thornwood Falls", set: "ema", lang: "ja" },
    { name: "Bojuka Bog", set: "c21", lang: "ja" },
    { name: "Commander's Sphere", set: "c17", lang: "ja" },
    { name: "Genesis Chamber", set: "bbd", lang: "ja" },
    { name: "Dimir Signet", set: "gk1", lang: "ja" },
    { name: "The Magic Mirror", set: "eld", lang: "ja" },
    { name: "Master Warcraft", set: "gk1", lang: "ja" },
    { name: "Slice and Dice", set: "c13", lang: "ja" },
];

/**
 * Some cards are legacy in the system and must be preserved. This function governs them
 */
const validateCustomCards: Validator = (bulkCard) => {
    return customCards
        .map((c) => {
            return (
                bulkCard.name === c.name &&
                bulkCard.set === c.set &&
                bulkCard.lang === c.lang
            );
        })
        .some((el) => !!el);
};

export default validateCustomCards;

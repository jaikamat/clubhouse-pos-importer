import { BulkCard } from "./cardValidators";
import validateCustomCards from "./validateCustomCard";

test("validates custom cards", () => {
    const cardA = {
        name: "Slice and Dice",
        set: "c13",
        lang: "ja",
    } as BulkCard;
    const cardB = { name: "Foobar", set: "c13", lang: "ja" } as BulkCard;

    expect(validateCustomCards(cardA)).toBeTruthy();
    expect(validateCustomCards(cardB)).toBeFalsy();
});

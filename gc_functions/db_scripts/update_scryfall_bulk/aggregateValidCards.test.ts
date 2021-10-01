import { acceptedLangs, BulkCard } from "./cardValidators";

test("accepted languages / sets", () => {
    const bulkCardA = { lang: "ja", set: "sta" } as BulkCard;

    expect(acceptedLangs(bulkCardA)).toBeTruthy();

    const bulkCardB = { lang: "en", set: "sta" } as BulkCard;

    expect(acceptedLangs(bulkCardB)).toBeTruthy();

    const bulkCardC = { lang: "ja", set: "foo" } as BulkCard;

    expect(acceptedLangs(bulkCardC)).toBeFalsy();
});

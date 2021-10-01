import { isAcceptedForeign, isAcceptedLang } from "./aggregateValidCards";

test("isAcceptedForeign", () => {
    expect(isAcceptedForeign({ lang: "en", set: "war" })).toBeFalsy();
    expect(isAcceptedForeign({ lang: "ja", set: "foo" })).toBeFalsy();
    expect(isAcceptedForeign({ lang: "ja", set: "war" })).toBeTruthy();
});

test("isAcceptedLang", () => {
    expect(isAcceptedLang({ lang: "kl" })).toBeFalsy();
    expect(isAcceptedLang({ lang: "en" })).toBeTruthy();
});

test("combine", () => {
    const bulkCardA = { lang: "ja", set: "sta" };

    expect(
        isAcceptedForeign(bulkCardA) || isAcceptedLang(bulkCardA)
    ).toBeTruthy();

    const bulkCardB = { lang: "en", set: "sta" };

    expect(
        isAcceptedForeign(bulkCardB) || isAcceptedLang(bulkCardB)
    ).toBeTruthy();

    const bulkCardC = { lang: "ja", set: "foo" };

    expect(
        isAcceptedForeign(bulkCardC) || isAcceptedLang(bulkCardC)
    ).toBeFalsy();
});

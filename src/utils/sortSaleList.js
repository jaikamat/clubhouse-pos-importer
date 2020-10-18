/**
 * Takes in an unordered group of cards and sorts them according to The Clubhouse's specs:
 * WUBRG, then multicolor, then colorless, then land, alphabetically within each color/category
 */
export default function sortSaleList(cards) {
    const ORDER = ['W', 'U', 'B', 'R', 'G', 'MULTI', 'COLORLESS', 'LAND'];

    /**
     * Main helper function that manages sort order
     * @param {Object} card
     */
    function helpSort(card) {
        let arrayConst = null;

        let colorsLength = null;
        let cardFace = null;

        try {
            // If colors don't exist, it's a flip card or storybook frame
            colorsLength = card.colors.length;
            cardFace = card;
        } catch (e) {
            try {
                // Storybook frames from Eldraine may throw error
                colorsLength = card.card_faces[0].colors.length;
                cardFace = card.card_faces[0];
            } catch (e) {
                colorsLength = card.colors.length;
                cardFace = card;
            }
        }

        // Apply logic to return correct constant enum
        if (colorsLength === 0) {
            arrayConst = 'COLORLESS';
        } else if (colorsLength === 1) {
            arrayConst = cardFace.colors[0];
        } else if (colorsLength > 1) {
            arrayConst = 'MULTI';
        }

        // Drill into colorless cards, if they are lands or not
        if (arrayConst === 'COLORLESS') {
            if (cardFace.color_identity) {
                if (cardFace.color_identity.length === 1) {
                    arrayConst = cardFace.color_identity[0];
                }
                if (cardFace.color_identity.length > 1) {
                    arrayConst = 'MULTI';
                }
            }
            if (cardFace.type_line.includes('Land')) {
                arrayConst = 'LAND';
            }
        }

        // Final check to guard against a null arrayConst
        if (!arrayConst) {
            arrayConst = 'LAND';
        }

        return arrayConst;
    }

    const alphaSort = cards.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const sorted = alphaSort.sort((a, b) => {
        return ORDER.indexOf(helpSort(a)) - ORDER.indexOf(helpSort(b));
    });

    return sorted;
}

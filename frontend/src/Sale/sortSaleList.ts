import { ClientCard } from '../utils/ClientCard';

const ORDER = ['W', 'U', 'B', 'R', 'G', 'MULTI', 'COLORLESS', 'LAND'] as const;

type Order = typeof ORDER[number];

/**
 * Main helper function that manages sort order
 * @param {Object} card
 */
function helpSort(card: ClientCard): Order {
    let cardFace = null;

    // First, get correct card face
    if (
        card.card_faces &&
        card.card_faces.length > 1 &&
        card.card_faces[0].colors // Adventure cards do not have a `colors` property on their faces
    ) {
        cardFace = card.card_faces[0];
    } else {
        cardFace = card;
    }

    /**
     * Devoid cards are an edge-case.
     *
     * If we know a card has no color and is devoid, we default to its color identity as a pip descriptor
     */
    if (card.keywords.includes('Devoid')) {
        if (cardFace.color_identity.length > 1) {
            return 'MULTI';
        } else {
            return cardFace.color_identity[0];
        }
    }

    if (cardFace.colors.length > 1) {
        return 'MULTI';
    }

    if (cardFace.colors.length === 0) {
        if (cardFace.type_line.includes('Land')) {
            return 'LAND';
        } else {
            return 'COLORLESS';
        }
    }

    return cardFace.colors[0];
}

/**
 * Takes in an unordered group of cards and sorts them according to The Clubhouse's specs:
 * WUBRG, then multicolor, then colorless, then land, alphabetically within each color/category
 */
export default function sortSaleList<T extends ClientCard>(cards: T[]) {
    const alphaSort = cards.sort((a, b) => a.name.localeCompare(b.name));

    return alphaSort.sort((a, b) => {
        return ORDER.indexOf(helpSort(a)) - ORDER.indexOf(helpSort(b));
    });
}

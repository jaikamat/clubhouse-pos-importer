import { ScryfallCard } from './ScryfallCard';

const getCardImage = (card: ScryfallCard) => {
    let myImage: string;

    try {
        // If normal prop doesn't exist, move to catch block for flip card faces
        myImage = card.image_uris.normal;
    } catch (e) {
        myImage = card.card_faces[0].image_uris.normal;
    }

    return myImage;
};
export default getCardImage;

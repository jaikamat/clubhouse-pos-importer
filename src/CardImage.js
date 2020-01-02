import React from 'react';
import { Image } from 'semantic-ui-react';

const CardImage = ({ image_uris, card_faces }) => {
    try {
        // If normal prop doesn't exist, move to catch block for flip card faces
        return <Image src={image_uris.normal} size="tiny" />;
    } catch (e) {
        return <Image src={card_faces[0].image_uris.normal} size="tiny" />;

        /**
         * Uncomment this if they want all card faces displayed, not just the front
         */
        // return card_faces.map(face => {
        //     return <Image src={face.image_uris.normal} size="tiny" />;
        // });
    }
};

export default CardImage;

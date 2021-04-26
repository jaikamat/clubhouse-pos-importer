import React, { FC, useState } from 'react';
import { Image } from 'semantic-ui-react';
import { ImageURIs, CardFace } from '../utils/ScryfallCard';

const style = {
    boxShadow: '2px 2px 5px 0 rgba(0,0,0,.25)',
    zIndex: '10',
    transition: 'all .2s ease-in-out',
};

interface Props {
    image_uris: ImageURIs;
    card_faces: CardFace[];
    image: string;
    hover: boolean;
}

const CardImage: FC<Props> = ({
    image_uris,
    card_faces,
    image,
    hover = true,
}) => {
    const [hovered, setHovered] = useState<boolean>(false);

    const mouseOver = () => setHovered(true);
    const mouseOut = () => setHovered(false);

    if (image) {
        return (
            <Image
                src={image}
                size="tiny"
                style={{
                    ...style,
                    transform: `${hovered ? 'scale(1.75)' : 'scale(1)'}`,
                }}
                onMouseOver={hover ? mouseOver : null}
                onMouseOut={hover ? mouseOut : null}
            />
        );
    }

    // TODO: This is obsolete logic that should be refactored out once all components ingest the ScryfallCard class,
    // which manages the correct image URL itself
    try {
        // If normal prop `image_uris.normal` doesn't exist, move to catch block for flip card faces
        return (
            <Image
                src={image_uris.normal}
                size="tiny"
                style={{
                    ...style,
                    transform: `${hovered ? 'scale(1.75)' : 'scale(1)'}`,
                }}
                onMouseOver={hover ? mouseOver : null}
                onMouseOut={hover ? mouseOut : null}
            />
        );
    } catch (e) {
        return (
            <Image
                src={card_faces[0].image_uris.normal}
                size="tiny"
                style={{
                    ...style,
                    transform: `${hovered ? 'scale(1.75)' : 'scale(1)'}`,
                }}
                onMouseOver={hover ? mouseOver : null}
                onMouseOut={hover ? mouseOut : null}
            />
        );
    }
};

export default CardImage;

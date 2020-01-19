import React from 'react';
import QohParser from './QohParser';
import { Image } from 'semantic-ui-react';
import MarketPrice from './MarketPrice';

const wrapperStyle = {
    position: 'relative',
    display: 'inline-block',
};

const overlayStyle = {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '9px 9px 9px 9px',
    zIndex: '1',
    borderRadius: '10px 10px 0 0',
    position: 'absolute',
    width: '300px',
    bottom: '0'
};

const inlineBlock = {
    display: 'inline-block',
};

const floatRight = {
    display: 'inline-block',
    float: 'right'
};

const roundedStyle = {
    borderRadius: '15px'
}

const image = (image_uris, card_faces) => {
    try {
        // If normal prop doesn't exist, move to catch block for flip card faces
        return <Image src={image_uris.normal} size="medium" style={roundedStyle} />;
    } catch (e) {
        return <Image src={card_faces[0].image_uris.normal} size="medium" style={roundedStyle} />;
    }
};

export default function PublicCardItem({ image_uris, card_faces, qoh, id }) {
    return (
        <React.Fragment>
            <div style={wrapperStyle}>
                {image(image_uris, card_faces)}
                <div style={overlayStyle}>
                    <div style={inlineBlock}>
                        <QohParser inventoryQty={qoh} />
                    </div>
                    <div style={floatRight}>
                        <MarketPrice id={id} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
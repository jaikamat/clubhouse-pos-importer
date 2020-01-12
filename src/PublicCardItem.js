import React from 'react';
import QohParser from './QohParser';
import { Image } from 'semantic-ui-react'

const wrapperStyle = {
    position: 'relative',
    display: 'inline-block',
};

const overlayStyle = {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '9px 9px 9px 9px',
    position: 'absolute',
    zIndex: '1',
    bottom: '0px',
    left: '14px',
    borderRadius: '7px'
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

export default function PublicCardItem({ image_uris, card_faces, qoh }) {
    return (
        <React.Fragment>
            <div style={wrapperStyle}>
                {image(image_uris, card_faces)}
                <div style={overlayStyle}>
                    <QohParser inventoryQty={qoh} />
                </div>
            </div>
        </React.Fragment>
    )
}
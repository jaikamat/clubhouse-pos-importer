import React from 'react';
import QohParser from './QohParser';
import { Image } from 'semantic-ui-react';
import MarketPrice from './MarketPrice';

const wrapperStyle = {
    display: 'inline-block',
    margin: '10px 10px 10px 10px'
};

const inventoryStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '9px 9px 9px 9px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '10px 10px 10px 10px',
    boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.25)'
};

const imageStyle = {
    width: '300px', // Width of the image when size="medium"
    height: '418.3px', // Height of the image when size="medium"
    boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.25)',
    background: 'repeating-linear-gradient(45deg, #bfbfbf, #bfbfbf 10px, #b0b0b0 10px, #b0b0b0 20px)',
    borderRadius: '15px'
}

export default function PublicCardItem({ image_uris, card_faces, qoh, id }) {
    let myImage;

    try {
        // If normal prop doesn't exist, move to catch block for flip card faces
        myImage = <Image src={image_uris.normal} size="medium" style={{ borderRadius: '15px' }} />
    } catch (e) {
        myImage = <Image src={card_faces[0].image_uris.normal} size="medium" style={{ borderRadius: '15px' }} />
    }

    return <React.Fragment>
        <div style={wrapperStyle}>
            <div style={imageStyle}>{myImage}</div>
            <div style={inventoryStyle}>
                <div><QohParser inventoryQty={qoh} /></div>
                <MarketPrice id={id} />
            </div>
        </div>
    </React.Fragment>
}
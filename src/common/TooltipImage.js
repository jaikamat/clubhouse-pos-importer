import React from 'react';
import { Image } from 'semantic-ui-react';

export default function TooltipImage({ image_uri, posX = 0 }) {
    return (
        <div style={{ // We use the style prop over styled-components because it renders much faster!
            position: 'absolute',
            left: `${posX}px`,
            width: '150px', // Width of the image when size="small"
            height: '209px', // Height of the image when size="small"
            borderRadius: '7px 7px 7px 7px',
            boxShadow: '2px 2px 5px 0 rgba(0, 0, 0, 0.25)',
            background: 'repeating-linear-gradient(45deg, #bfbfbf, #bfbfbf 10px, #b0b0b0 10px, #b0b0b0 20px)',
            zIndex: '5000'
        }}>
            <Image
                style={{ borderRadius: '7px 7px 7px 7px' }}
                size="small"
                src={image_uri}
            />
        </div>
    )
}
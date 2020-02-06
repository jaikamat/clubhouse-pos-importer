import React from 'react';
import { Image } from 'semantic-ui-react';

const style = {
    boxShadow: '2px 2px 5px 0 rgba(0,0,0,.25)',
    zIndex: '10',
    transition: 'all .2s ease-in-out'
}

class CardImage extends React.Component {
    state = { hovered: false };

    mouseOver = () => { this.setState({ hovered: true }) };

    mouseOut = () => { this.setState({ hovered: false }) };

    render() {
        const { image_uris, card_faces, hover = true } = this.props // default prop `hover` must be true
        try {
            // If normal prop `image_uris.normal` doesn't exist, move to catch block for flip card faces
            return <Image
                src={image_uris.normal}
                size="tiny"
                style={{ ...style, transform: `${this.state.hovered ? 'scale(1.75)' : 'scale(1)'}` }}
                onMouseOver={hover ? this.mouseOver : null}
                onMouseOut={hover ? this.mouseOut : null}
            />;
        } catch (e) {
            return <Image src={
                card_faces[0].image_uris.normal}
                size="tiny"
                style={{ ...style, transform: `${this.state.hovered ? 'scale(1.75)' : 'scale(1)'}` }}
                onMouseOver={hover ? this.mouseOver : null}
                onMouseOut={hover ? this.mouseOut : null}
            />;
        }
    }
};

export default CardImage;

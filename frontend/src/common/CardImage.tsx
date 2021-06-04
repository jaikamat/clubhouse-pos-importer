import React, { FC, useState } from 'react';
import { Image } from 'semantic-ui-react';
import styled from 'styled-components';

interface Props {
    image: string;
    hover?: boolean;
}

const StyledImage = styled(Image)({
    boxShadow: '2px 2px 5px 0 rgba(0,0,0,.25)',
    zIndex: 10,
    transition: 'all .2s ease-in-out',
});

const CardImage: FC<Props> = ({ image, hover }) => {
    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <StyledImage
            src={image}
            onMouseOver={() => (hover ? setHovered(true) : null)}
            onMouseOut={() => (hover ? setHovered(false) : null)}
            style={{
                transform: `${hovered ? 'scale(1.75)' : 'scale(1)'}`,
            }}
        />
    );
};

export default CardImage;

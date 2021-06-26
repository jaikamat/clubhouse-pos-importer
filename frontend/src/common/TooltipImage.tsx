import React, { FC } from 'react';
import { Image } from 'semantic-ui-react';

interface Props {
    image_uri: string;
}

const TooltipImage: FC<Props> = ({ image_uri }) => {
    return (
        <Image
            style={{ borderRadius: '7px 7px 7px 7px' }}
            size="small"
            src={image_uri}
        />
    );
};

export default TooltipImage;

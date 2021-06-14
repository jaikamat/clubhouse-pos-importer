import React, { FC } from 'react';
import { Button as MUIButton, ButtonProps } from '@material-ui/core';

type Props = Omit<ButtonProps, 'variant' | 'color' | 'disableElevation'> & {
    primary?: boolean;
};

const Button: FC<Props> = ({ primary, children, ...props }) => {
    return (
        <MUIButton
            color="primary"
            disableElevation
            variant={primary ? 'contained' : 'outlined'}
            {...props}
        >
            {children}
        </MUIButton>
    );
};

export default Button;

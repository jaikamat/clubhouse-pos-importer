import { Typography } from '@material-ui/core';
import React, { FC } from 'react';

export const HeaderText: FC = ({ children }) => {
    return <Typography variant="h4">{children}</Typography>;
};

import { Box, CircularProgress } from '@material-ui/core';
import React, { FC } from 'react';

const Loading: FC = () => {
    return (
        <Box display="flex" justifyContent="center" width={1} py={3}>
            <CircularProgress />
        </Box>
    );
};

export default Loading;

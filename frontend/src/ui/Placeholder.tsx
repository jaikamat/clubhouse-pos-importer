import React, { FC } from 'react';
import { Box, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles(({ typography, spacing }) => ({
    font: {
        fontWeight: typography.fontWeightBold,
    },
    container: {
        boxShadow: '0 2px 25px 0 rgb(34 36 38 / 5%) inset',
        backgroundColor: 'transparent',
    },
    flexContainer: {
        minHeight: spacing(20),
    },
}));

const Placeholder: FC = ({ children }) => {
    const { font, container, flexContainer } = useStyles();

    return (
        <Paper variant="outlined" className={container}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                className={flexContainer}
            >
                <Typography variant="h6" className={font}>
                    {children}
                </Typography>
            </Box>
        </Paper>
    );
};

export default Placeholder;

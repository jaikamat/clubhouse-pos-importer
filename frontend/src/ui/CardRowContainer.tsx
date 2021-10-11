import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';

interface Props {
    image: ReactNode;
    header: ReactNode;
}

const useStyles = makeStyles(({ spacing, zIndex }) => ({
    headerContainer: {
        paddingBottom: spacing(3),
    },
    imageContainer: {
        zIndex: zIndex.mobileStepper,
    },
}));

const CardRowContainer: FC<Props> = ({ image, header, children }) => {
    const { headerContainer, imageContainer } = useStyles();

    return (
        <Paper variant="outlined">
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item className={imageContainer}>
                        {image}
                    </Grid>
                    <Grid item xs={10}>
                        <div className={headerContainer}>{header}</div>
                        <div>{children}</div>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default CardRowContainer;

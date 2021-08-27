import { Box, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';

interface Props {
    image: ReactNode;
    header: ReactNode;
}

const useStyles = makeStyles(({ spacing }) => ({
    headerContainer: {
        paddingBottom: spacing(3),
    },
}));

const CardRowContainer: FC<Props> = ({ image, header, children }) => {
    const { headerContainer } = useStyles();

    return (
        <Paper variant="outlined">
            <Box p={2}>
                <Grid container spacing={2}>
                    <Grid item alignItems="center" justifyContent="center">
                        {image}
                    </Grid>
                    <Grid item xs={10} alignContent="space-between">
                        <div className={headerContainer}>{header}</div>
                        <div>{children}</div>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default CardRowContainer;

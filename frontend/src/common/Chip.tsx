import { Chip as MUIChip, ChipProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC } from 'react';

type Props = ChipProps & { foil?: boolean };

const useStyles = makeStyles({
    foilContainer: {
        backgroundColor: '#ffcfdf !important',
        backgroundImage:
            'linear-gradient(90deg, #ffcfdf 0%, #b0f3f1 74%) !important',
    },
    border: {
        borderRadius: 5,
    },
});

const Chip: FC<Props> = (props) => {
    const { foilContainer, border } = useStyles();

    if (props.foil) {
        return <MUIChip {...props} className={clsx(foilContainer, border)} />;
    }

    return <MUIChip {...props} className={border} />;
};

export default Chip;

import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles({
    meta: {
        '& > *:not(:last-of-type):after': {
            content: '" • "',
        },
    },
});

const MetaData: FC = ({ children }) => {
    const { meta } = useStyles();
    return <span className={meta}>{children}</span>;
};

export default MetaData;

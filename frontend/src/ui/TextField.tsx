import {
    FormHelperText,
    TextField as MUITextField,
    TextFieldProps,
} from '@material-ui/core';
import { FC } from 'react';

type Props = {
    error?: string;
} & Omit<TextFieldProps, 'error'>;

const TextField: FC<Props> = ({ error, ...props }) => {
    return (
        <>
            <MUITextField error={!!error} {...props} />
            {error && <FormHelperText error>{error}</FormHelperText>}
        </>
    );
};

export default TextField;

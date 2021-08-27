import {
    FormHelperText,
    TextField as MUITextField,
    TextFieldProps,
} from '@material-ui/core';
import { FC } from 'react';

type Props = {
    error?: string;
} & Omit<TextFieldProps, 'error' | 'variant' | 'size'>;

const TextField: FC<Props> = ({ error, ...props }) => {
    return (
        <>
            <MUITextField
                variant="outlined"
                size="small"
                error={!!error}
                {...props}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
        </>
    );
};

export default TextField;

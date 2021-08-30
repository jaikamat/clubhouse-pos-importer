import {
    FormHelperText,
    TextField as MUITextField,
    TextFieldProps,
} from '@material-ui/core';
import { FC } from 'react';

type Props = {
    error?: string;
    label: string;
} & Omit<TextFieldProps, 'error' | 'variant' | 'size' | 'label'>;

const TextField: FC<Props> = ({ error, label, ...props }) => {
    return (
        <>
            <MUITextField
                id={label}
                label={label}
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

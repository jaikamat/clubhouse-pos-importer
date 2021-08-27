import { FormControl, TextField } from '@material-ui/core';
import { ChangeEvent, FC } from 'react';

interface FormikNativeDatePickerProps {
    label: string;
    name: string;
    defaultValue: string;
    handleChange: (e: ChangeEvent) => void;
    min?: string;
    max?: string;
}

export const FormikNativeDatePicker: FC<FormikNativeDatePickerProps> = ({
    label,
    name,
    defaultValue,
    handleChange,
    min,
    max,
}) => {
    return (
        <FormControl fullWidth>
            <TextField
                id={name}
                label={label}
                name={name}
                size="small"
                variant="outlined"
                type="date"
                onChange={handleChange}
                defaultValue={defaultValue}
                InputProps={{
                    inputProps: {
                        min,
                        max,
                    },
                }}
            />
        </FormControl>
    );
};

export default FormikNativeDatePicker;

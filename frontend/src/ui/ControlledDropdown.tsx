import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectProps,
} from '@material-ui/core';
import { ChangeEvent } from 'react';

export interface DropdownOption {
    key: string;
    value: string | number;
    text: string;
}

type ControlledDropdownProps = {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    error?: string;
} & Omit<SelectProps, 'name' | 'multiple' | 'value' | 'onChange' | 'error'>;

function ControlledDropdown({
    label,
    name,
    value,
    onChange,
    options,
    error,
    ...props
}: ControlledDropdownProps) {
    return (
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                error={!!error}
                label={label}
                name={name}
                value={value}
                onChange={(e: ChangeEvent<{ value: unknown }>) => {
                    onChange(e.target.value as string);
                }}
                {...props}
            >
                {options.map((o, idx) => (
                    <MenuItem key={`${o.value}-${idx}`} value={o.value}>
                        {o.text}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
    );
}

export default ControlledDropdown;

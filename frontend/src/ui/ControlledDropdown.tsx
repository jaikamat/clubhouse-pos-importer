import {
    FormControl,
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
} & Omit<SelectProps, 'name' | 'multiple' | 'value' | 'onChange'>;

function ControlledDropdown({
    label,
    name,
    value,
    onChange,
    options,
    ...props
}: ControlledDropdownProps) {
    return (
        <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
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
        </FormControl>
    );
}

export default ControlledDropdown;

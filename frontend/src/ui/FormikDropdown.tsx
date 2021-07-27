import { FormFieldProps, Dropdown, DropdownProps } from 'semantic-ui-react';
import { ChangeEvent, SyntheticEvent } from 'react';
import {
    Select,
    SelectProps,
    MenuItem,
    FormControl,
    InputLabel,
    makeStyles,
} from '@material-ui/core';

type FormikDropdownFieldProps<T> = {
    name: string;
    onChange: (value: DropdownProps['value']) => void;
    options: T[];
} & Omit<FormFieldProps, 'name' | 'options' | 'onChange'>;

function FormikDropdown<T>({
    label,
    name,
    onChange,
    options,
    ...props
}: FormikDropdownFieldProps<T>) {
    return (
        <Dropdown
            options={options}
            name={name}
            onChange={(_: SyntheticEvent, data: DropdownProps) => {
                onChange(data.value);
            }}
            {...props}
        />
    );
}

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: '100%',
    },
}));

export interface DropdownOption {
    key: string;
    value: string | number;
    text: string;
}

type MUIFormikDropdownFieldProps = {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
} & Omit<SelectProps, 'name' | 'multiple' | 'value' | 'onChange'>;

export function MUIFormikDropdown({
    label,
    name,
    value,
    onChange,
    options,
    ...props
}: MUIFormikDropdownFieldProps) {
    const { formControl } = useStyles();

    return (
        <FormControl className={formControl} variant="outlined">
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

type MUIFormikMultiSelectFieldProps = {
    name: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: DropdownOption[];
} & Omit<SelectProps, 'name' | 'multiple' | 'value' | 'onChange'>;

export function MUIFormikMultiSelect({
    label,
    name,
    value,
    onChange,
    options,
    ...props
}: MUIFormikMultiSelectFieldProps) {
    const { formControl } = useStyles();

    return (
        <FormControl className={formControl} variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                name={name}
                multiple
                renderValue={(s) => (s as string[]).join(', ')}
                value={value}
                onChange={(e: ChangeEvent<{ value: unknown }>) => {
                    onChange(e.target.value as string[]);
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

export default FormikDropdown;

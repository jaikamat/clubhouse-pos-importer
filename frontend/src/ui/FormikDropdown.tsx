import { FormFieldProps, Dropdown, DropdownProps } from 'semantic-ui-react';
import { SyntheticEvent } from 'react';

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

export default FormikDropdown;

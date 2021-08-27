import { Form, FormFieldProps, Select } from 'semantic-ui-react';

type FormSelectFieldProps<T> = {
    label: string;
    name: string;
    onChange: (value: string) => void;
    options: T[];
    error?: string;
} & Omit<FormFieldProps, 'label' | 'name' | 'options' | 'onChange'>;

function FormikSelectField<T>({
    label,
    name,
    options,
    onChange,
    error,
    ...props
}: FormSelectFieldProps<T>) {
    return (
        <Form.Field
            error={error}
            control={Select}
            label={label}
            placeholder={label}
            options={options}
            name={name}
            onChange={(_: any, { value }: { value: string }) => {
                onChange(value);
            }}
            {...props}
        />
    );
}

export default FormikSelectField;

import { Form, FormFieldProps, Input } from 'semantic-ui-react';
import { FieldConfig, FormikBag, FormikProps } from 'formik';
import { ChangeEvent, FC } from 'react';

type FormikFieldProps<T> = {
    field: FieldConfig;
    form: FormikProps<T>;
    label: string;
    defaultValue?: string;
    min?: string;
    max?: string;
} & Omit<FormFieldProps, 'label' | 'name'>;

/**
 * This is meant to be wrapped by a <Field /> component.
 *
 * The generics are inferred by passed prop values.
 */
function FormikNativeDatePicker<T>({
    label,
    /** Injected by <Field /> */
    field,
    /** Injected by <Field /> */
    form,
    defaultValue,
    min,
    max,
}: FormikFieldProps<T>) {
    return (
        <Form.Field>
            <label>{label}</label>
            <Input
                id={field.name}
                name={field.name}
                type="date"
                onChange={form.handleChange}
                defaultValue={defaultValue}
                min={min}
                max={max}
            />
        </Form.Field>
    );
}

interface FormNativeDatePickerProps {
    label: string;
    name: string;
    defaultValue: string;
    handleChange: (e: ChangeEvent) => void;
    min?: string;
    max?: string;
}

export const FormNativeDatePicker: FC<FormNativeDatePickerProps> = ({
    label,
    name,
    defaultValue,
    handleChange,
    min,
    max,
}) => {
    return (
        <Form.Field>
            <label>{label}</label>
            <Input
                id={name}
                name={name}
                type="date"
                onChange={handleChange}
                defaultValue={defaultValue}
                min={min}
                max={max}
            />
        </Form.Field>
    );
};

export default FormikNativeDatePicker;

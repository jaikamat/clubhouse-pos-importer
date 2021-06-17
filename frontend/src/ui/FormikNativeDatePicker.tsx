import { Form, FormFieldProps, Input } from 'semantic-ui-react';
import { FieldConfig, FormikProps } from 'formik';

type FormikFieldProps<T> = {
    field: FieldConfig;
    form: FormikProps<T>;
    label: string;
    defaultValue?: string;
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
            />
        </Form.Field>
    );
}

export default FormikNativeDatePicker;

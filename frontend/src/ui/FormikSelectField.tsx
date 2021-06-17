import { Form, Select, FormFieldProps } from 'semantic-ui-react';
import { FieldConfig, FormikProps } from 'formik';

type FormikFieldProps<T, O> = {
    field: FieldConfig;
    form: FormikProps<T>;
    label: string;
    options: O[];
} & Omit<FormFieldProps, 'label' | 'name' | 'options'>;

/**
 * This is meant to be wrapped by a <Form /> component.
 *
 * The generics are inferred by passed prop values.
 */
function FormikSelectField<T, O>({
    label,
    options,
    /** Injected by <Form /> */
    field,
    /** Injected by <Form /> */
    form,
    ...props
}: FormikFieldProps<T, O>) {
    return (
        <Form.Field
            control={Select}
            label={label}
            placeholder={label}
            options={options}
            name={field.name}
            onChange={(_: any, { value }: { value: string }) => {
                form.setFieldValue(field.name, value);
            }}
            {...props}
        />
    );
}

export default FormikSelectField;

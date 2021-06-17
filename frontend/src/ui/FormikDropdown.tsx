import { FormFieldProps, Dropdown } from 'semantic-ui-react';
import { FieldConfig, FormikProps } from 'formik';
import { SyntheticEvent } from 'react';

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
function FormikDropdown<T, O>({
    options,
    /** Injected by <Form /> */
    field,
    /** Injected by <Form /> */
    form,
    ...props
}: FormikFieldProps<T, O>) {
    return (
        <Dropdown
            options={options}
            name={field.name}
            onChange={(_: SyntheticEvent, data) => {
                form.setFieldValue(field.name, data.value);
            }}
            {...props}
        />
    );
}

export default FormikDropdown;

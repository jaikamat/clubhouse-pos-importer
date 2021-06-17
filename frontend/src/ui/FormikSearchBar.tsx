import { Form, FormFieldProps } from 'semantic-ui-react';
import { FieldConfig, FormikProps } from 'formik';
import SearchBar from '../common/SearchBar';
import { SyntheticEvent } from 'react';

type FormikFieldProps<T> = {
    field: FieldConfig;
    form: FormikProps<T>;
    label: string;
} & Omit<FormFieldProps, 'label' | 'name'>;

/**
 * This is meant to be wrapped by a <Field /> component.
 *
 * The generics are inferred by passed prop values.
 */
function FormikSearchBar<T>({
    label,
    /** Injected by <Field /> */
    field,
    /** Injected by <Field /> */
    form,
}: FormikFieldProps<T>) {
    return (
        <Form.Field>
            <label>{label}</label>
            <SearchBar
                handleSearchSelect={(value) => {
                    form.setFieldValue(field.name, value);
                }}
                // Reset form state after user blurs cardName
                onBlur={(event: SyntheticEvent<Element, Event>) => {
                    const element = event.target as HTMLInputElement;
                    form.setFieldValue(field.name, element.value);
                }}
            />
        </Form.Field>
    );
}

export default FormikSearchBar;

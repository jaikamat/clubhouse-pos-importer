import { Form, Input } from 'semantic-ui-react';
import { ChangeEvent, FC } from 'react';

interface FormikNativeDatePickerProps {
    label: string;
    name: string;
    defaultValue: string;
    handleChange: (e: ChangeEvent) => void;
    min?: string;
    max?: string;
}

export const FormikNativeDatePicker: FC<FormikNativeDatePickerProps> = ({
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

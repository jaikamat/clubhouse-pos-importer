import { Form } from 'semantic-ui-react';
import { FC, SyntheticEvent } from 'react';
import ControlledSearchBar from '../common/ControlledSearchBar';

interface FormikControlledSearchBarProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export const FormikControlledSearchBar: FC<FormikControlledSearchBarProps> = ({
    label,
    value,
    onChange,
}) => {
    return (
        <Form.Field>
            <label>{label}</label>
            <ControlledSearchBar
                value={value}
                onChange={(value) => {
                    onChange(value);
                }}
                // Reset form state after user blurs cardName
                onBlur={(event: SyntheticEvent<Element, Event>) => {
                    const element = event.target as HTMLInputElement;
                    onChange(element.value);
                }}
            />
        </Form.Field>
    );
};

export default FormikControlledSearchBar;

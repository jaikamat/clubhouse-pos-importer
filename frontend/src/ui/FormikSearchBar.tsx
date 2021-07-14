import { Form } from 'semantic-ui-react';
import SearchBar from '../common/SearchBar';
import { FC, SyntheticEvent } from 'react';
import ControlledSearchBar from '../common/ControlledSearchBar';

interface FormikSearchBarProps {
    label: string;
    onChange: (value: string) => void;
}

const FormikSearchBar: FC<FormikSearchBarProps> = ({ label, onChange }) => {
    return (
        <Form.Field>
            <label>{label}</label>
            <SearchBar
                handleSearchSelect={(value) => {
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
                onChange={onChange}
                // Reset form state after user blurs cardName
                onBlur={(event: SyntheticEvent<Element, Event>) => {
                    const element = event.target as HTMLInputElement;
                    onChange(element.value);
                }}
            />
        </Form.Field>
    );
};

export default FormikSearchBar;

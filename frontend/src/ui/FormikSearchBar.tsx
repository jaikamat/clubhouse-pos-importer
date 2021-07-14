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
                // Set form state to current value after blur (useful for partial name searches)
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
                // Set form state to current value after blur (useful for partial name searches)
                onBlur={(event: SyntheticEvent<Element, Event>) => {
                    const element = event.target as HTMLInputElement;
                    onChange(element.value);
                }}
            />
        </Form.Field>
    );
};

export default FormikSearchBar;

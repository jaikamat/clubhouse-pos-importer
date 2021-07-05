import { Form } from 'semantic-ui-react';
import SearchBar from '../common/SearchBar';
import { FC, SyntheticEvent } from 'react';

interface FormikSearchBarProps {
    label: string;
    onChange: (value: string) => void;
}

export const FormikSearchBar: FC<FormikSearchBarProps> = ({
    label,
    onChange,
}) => {
    return (
        <Form.Field>
            <label>{label}</label>
            <SearchBar
                handleSearchSelect={(value) => {
                    onChange(value);
                    // setFieldValue('cardName', value);
                }}
                // Reset form state after user blurs cardName
                onBlur={(event: SyntheticEvent<Element, Event>) => {
                    const element = event.target as HTMLInputElement;
                    onChange(element.value);
                    // setFieldValue('cardName', element.value);
                }}
            />
        </Form.Field>
    );
};

export default FormikSearchBar;

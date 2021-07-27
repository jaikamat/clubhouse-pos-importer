import { FC, SyntheticEvent } from 'react';
import ControlledSearchBar from './ControlledSearchBar';

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
    );
};

export default FormikControlledSearchBar;

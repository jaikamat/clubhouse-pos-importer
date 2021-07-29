import { FC, SyntheticEvent } from 'react';
import SearchBar, { Option } from './SearchBar';

interface FormikControlledSearchBarProps {
    label: string;
    value: string;
    onChange: (value: Option | null) => void;
}

export const FormikControlledSearchBar: FC<FormikControlledSearchBarProps> = ({
    label,
    value,
    onChange,
}) => {
    return <SearchBar value={value} onChange={onChange} />;
};

export default FormikControlledSearchBar;

import { FC, SyntheticEvent } from 'react';
import SearchBar, { Option } from './SearchBar';

interface ControlledSearchBarProps {
    label: string;
    value: string;
    onChange: (value: Option | null) => void;
}

export const ControlledSearchBar: FC<ControlledSearchBarProps> = ({
    label,
    value,
    onChange,
}) => {
    return <SearchBar value={value} onChange={onChange} />;
};

export default ControlledSearchBar;

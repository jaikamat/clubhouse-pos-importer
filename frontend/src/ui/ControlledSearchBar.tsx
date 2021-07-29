import { FC } from 'react';
import SearchBar from './SearchBar';

interface ControlledSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const ControlledSearchBar: FC<ControlledSearchBarProps> = ({
    value,
    onChange,
}) => {
    return (
        <SearchBar
            value={value ? { title: value } : null}
            onChange={(v) => (v ? onChange(v.title) : onChange(''))}
        />
    );
};

export default ControlledSearchBar;

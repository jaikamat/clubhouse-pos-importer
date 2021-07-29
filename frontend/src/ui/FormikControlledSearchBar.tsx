import { FC, SyntheticEvent } from 'react';
import ControlledSearchBar, { Option } from './ControlledSearchBar';

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
    return <ControlledSearchBar value={value} onChange={onChange} />;
};

export default FormikControlledSearchBar;

import React, { FC } from 'react';
import { TextField } from '@material-ui/core';

interface Props {
    value: string;
    onChange: (v: string) => void;
    label: string;
    name: string;
}

const IntegerInput: FC<Props> = ({ value, onChange, label, name }) => {
    return (
        <TextField
            fullWidth
            type="number"
            size="small"
            variant="outlined"
            label={label}
            name={name}
            value={value}
            InputProps={{
                inputProps: {
                    min: 1,
                },
            }}
            onBlur={(e) => {
                const value = e.target.value;
                const transformed = parseInt(value);
                if (isNaN(transformed) || transformed < 1) {
                    return onChange('1');
                }
            }}
            onChange={(e) => {
                onChange(e.target.value);
            }}
        />
    );
};

export default IntegerInput;

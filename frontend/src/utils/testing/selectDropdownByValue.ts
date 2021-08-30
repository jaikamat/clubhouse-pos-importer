import { screen, within } from '@testing-library/react';

const selectDropdownByValue = (value: string) => {
    // Get the parent of the <input /> element that has desired value
    const selectContainer = screen.getByDisplayValue(value).parentElement!;
    // MUI's Select component uses `role=button`
    const select = within(selectContainer).getByRole('button');

    return select;
};

export default selectDropdownByValue;

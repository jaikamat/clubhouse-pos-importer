import { screen, within } from '@testing-library/react';

/**
 * Extracts a select component from a MUI Select.
 *
 * It's buried pretty deeply in there, so we have to be creative -
 * I referred to MUI library test files to create this logic.
 */
const selectDropdownByValue = (value: string) => {
    // Get the parent of the <input /> element that has desired value
    const selectContainer = screen.getByDisplayValue(value).parentElement!;
    // MUI's Select component uses `role=button`
    const select = within(selectContainer).getByRole('button');

    return select;
};

export default selectDropdownByValue;

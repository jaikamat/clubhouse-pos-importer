import { fireEvent, screen, within } from '@testing-library/react';

/**
 * Clicks a dropdown option, given a dropdown
 */
const dropdownOptionClick = (selectElement: HTMLElement, valueText: string) => {
    fireEvent.mouseDown(selectElement);
    const listbox = screen.getByRole('listbox'); // MUI select produces a listbox
    fireEvent.click(within(listbox).getByText(valueText));
};

export default dropdownOptionClick;

import { screen } from '@testing-library/react';

/**
 * Caches a found element for current state assertions
 */
const currentByLabelText = (text: string) => {
    let element: HTMLElement;

    return async () => {
        element = await screen.findByLabelText(text);

        return element;
    };
};

export default currentByLabelText;

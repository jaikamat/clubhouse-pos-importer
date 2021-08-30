import { screen } from '@testing-library/react';

/**
 * Returns a function that caches the current button for repeated assertion
 */
const currentButton = (buttonText: string) => {
    let button: HTMLButtonElement;

    return async () => {
        button = (await screen.findByText(buttonText)).closest('button')!;

        return button;
    };
};

export default currentButton;

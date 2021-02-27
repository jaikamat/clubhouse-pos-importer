import { render, screen } from '@testing-library/react';
import Price from './Price';

test('Price', () => {
    render(<Price num="3.33" />);
    screen.getByText('$3.33');
    render(<Price num="asdf" />);
    screen.getByText('$0.00');
    render(<Price num={765.432} />);
    screen.getByText('$765.43');
});

test('Price', () => {
    render(<Price num={-765.437} />);
    screen.getByText('$-765.44');
});

test('Price', () => {
    render(<Price num="-765.437" />);
    screen.getByText('$-765.44');
});

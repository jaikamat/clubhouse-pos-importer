import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import NavLinks from './NavLinks';

test('Correct link navigation', async () => {
    const pathHistory: string[] = [];

    render(
        <MemoryRouter initialEntries={['/']}>
            <Route
                render={({ location }) => {
                    pathHistory.push(location.pathname);
                    return '';
                }}
            />
            <NavLinks />
        </MemoryRouter>
    );

    await screen.findByText('Manage Inventory');
    await screen.findByText('New Sale');
    await screen.findByText('Receiving');
    await screen.findByText('Browse Inventory');
    await screen.findByText('Browse Sales');
    await screen.findByText('Browse Receiving');
    await screen.findByText('Log Out');

    await fireEvent.click(await screen.findByText('Manage Inventory'));
    await fireEvent.click(await screen.findByText('New Sale'));
    await fireEvent.click(await screen.findByText('Receiving'));
    await fireEvent.click(await screen.findByText('Browse Inventory'));
    await fireEvent.click(await screen.findByText('Browse Sales'));
    await fireEvent.click(await screen.findByText('Browse Receiving'));
    await fireEvent.click(await screen.findByText('Log Out'));

    expect(pathHistory).toMatchInlineSnapshot(`
        Array [
          "/",
          "/manage-inventory",
          "/new-sale",
          "/receiving",
          "/browse-inventory",
          "/browse-sales",
          "/browse-receiving",
        ]
    `);
});

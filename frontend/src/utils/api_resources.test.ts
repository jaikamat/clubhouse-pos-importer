import { getPrefix, isProd, testEndpoint } from './api_resources';

// CRA exposes NODE_ENV as 'test' when running `npm test`
test('environment variables', () => {
    expect(isProd()).toBeFalsy();
});

test('resource path prefix', () => {
    expect(getPrefix()).toMatchInlineSnapshot(`"http://localhost:7331"`);
});

test('resource path postfix', () => {
    expect(testEndpoint()).toMatchInlineSnapshot(`"_test"`);
});

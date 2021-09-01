import {
    authedEndpoint,
    gcfEndpoint,
    getPrefix,
    isProd,
    publicEndpoint,
    testEndpoint,
} from './endpoints';

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

test('endpoint permissions', () => {
    expect(authedEndpoint('tester')).toMatchInlineSnapshot(
        `"http://localhost:7331/auth/tester"`
    );
    expect(publicEndpoint('tester')).toMatchInlineSnapshot(
        `"http://localhost:7331/tester"`
    );
    expect(gcfEndpoint('tester')).toMatchInlineSnapshot(`"tester_test"`);
});

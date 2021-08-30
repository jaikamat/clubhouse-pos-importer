/**
 * Mock module for axios used for request interception in testing
 */
const mockHttp = (data: any) => ({
    __esModule: true,
    default: {
        create: () => jest.createMockFromModule('axios'),
        get: () => Promise.resolve({ data }),
        // TODO: How to spy on this to ensure the submit is correct?
        // I am unsure how to effectively spy on this or gain a reference to it through jest.fn()
        post: (...args: any) => Promise.resolve({ data: args }),
    },
});

export default mockHttp;

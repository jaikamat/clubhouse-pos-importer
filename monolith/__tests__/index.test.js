const { ExpectationFailed } = require('http-errors');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Set up the mongo memory instance
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    // Interactors use this to establish a connection
    process.env.MONGO_URI = await mongoServer.getUri();
});

afterAll(async () => {
    await mongoServer.stop();
});

test('A single test', async () => {
    expect(1 + 1).toBe(2);
});

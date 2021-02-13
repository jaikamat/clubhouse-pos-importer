const { ExpectationFailed } = require('http-errors');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Set up the mongo memory instance
beforeAll(async () => {
    const mongod = new MongoMemoryServer();

    const uri = await mongod.getUri();

    console.log(uri);

    await mongod.stop();
});

test('A single test', async () => {
    expect(1 + 1).toBe(2);
});

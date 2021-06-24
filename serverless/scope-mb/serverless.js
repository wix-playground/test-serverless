module.exports = (fb) => fb.addWebFunction('GET', '/hello', async (_ctx, _req) => { return 'Hello!';}); 

module.exports = (fb) =>
fb.addWebFunction('GET', '/hello', async (ctx, req) => {
        return 'Hello, world!';
    });

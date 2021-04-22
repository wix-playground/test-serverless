module.exports = (fb) =>
fb.addWebFunction('GET', '/init-secret', async (ctx, req) => {
        return 'Hello, world!';
    });

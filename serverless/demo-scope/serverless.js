module.exports = (fb) =>
fb.addWebFunction('GET', '/hello', async (ctx, req) => {
        return ctx.getConfig('secret1');
    });

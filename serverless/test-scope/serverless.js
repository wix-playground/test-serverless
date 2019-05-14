//feel free to add your example functions here if you do not want to create separate scope

module.exports = (functionsBuilder, initCtx) => {
    const initSecret = (name) => initCtx.getConfig(name);
    return functionsBuilder
        .withNamespace('example-namespace')
        .addWebFunction('GET', '/init-secret', async (ctx, req) => {
            return initSecret(req.params.secretName);
        })
        .addWebFunction('GET', '/secret', async (ctx, req) => {
            return ctx.getConfig(req.params.secretName);
        });
};
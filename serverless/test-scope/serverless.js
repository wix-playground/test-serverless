//feel free to add your example functions here if you do not want to create separate scope

module.exports = (functionsBuilder, initCtx) => {
    const initSecret = (name) => initCtx.getConfig(name);
    return functionsBuilder
        .addWebFunction('GET', '/init-secret', async (ctx, req) => {
            return initSecret(req.params.secretName);
        })
        .addWebFunction('GET', '/secret', async (ctx, req) => {
            return ctx.getConfig(req.params.secretName);
        })
       .addWebFunction('POST', `/generate/:prefix`, async (ctx, req) => {
           const start = Date.now();
           const prefix = req.params.prefix;
           const promises = [];
           for (let i = 0; i < 1000; i++) {
               promises[i] = ctx.datastore.put(`${prefix}_${i}`, 'some value');
           }
           await Promise.all(promises);
           return {timePassed: Date.now - start};
       })
      .addWebFunction('GET', `/read/:prefix`, async (ctx, req) => {
          const start = Date.now();
          const prefix = req.params.prefix;
          const kvPairs = await ctx.datastore.list(prefix);
          return {timePassed: Date.now - start};
      });
};
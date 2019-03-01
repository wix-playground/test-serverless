module.exports = (functionsBuilder) =>
  functionsBuilder
    .withNamespace('example')
    .addWebFunction('POST', '/', async (ctx, req) => {
      const {wix} = require('@wix/adi-waas-platformized-api/dist/proto-generated');
      const result = await ctx.rpcClient(wix.adi.api.waas.v1.SiteService, '@wix/adi-waas-platformized-api').clear(ctx.aspects, {instanceId: 'instanceId'});
      return result;
    })
    .addWebFunction('GET', '/get', async (ctx, req) => {
      return {version: 4};
    });

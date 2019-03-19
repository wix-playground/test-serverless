const {FullHttpResponse} = require('@wix/serverless-api');

module.exports = (functionsBuilder) =>
  functionsBuilder
    .withNamespace('example')
    .addWebFunction('POST', '/', async (ctx, req) => {
      await ctx.datastore.put('data', {val: 'value'});
      return new FullHttpResponse({status: 204, body: {}});
    })
    .addWebFunction('GET', '/get', async (ctx, req) => {
      const value = await ctx.datastore.get('data');
      return {version: 8, message: 'message', ...value};
    });

const {FullHttpResponse} = require('@wix/serverless-api');

module.exports = (functionsBuilder) =>
  functionsBuilder
    .withNamespace('example')
    .addWebFunction('POST', '/', async (ctx, req) => {
      await ctx.datastore.put('data', 'value');
      return new FullHttpResponse({status: 204, body: {}});
    })
    .addWebFunction('GET', '/get', async (ctx, req) => {
      const value = await ctx.datastore.get('data');
      return {version: 7, message: 'message', anotherField: value};
    });

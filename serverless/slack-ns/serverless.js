module.exports = functionsBuilder =>
  functionsBuilder
    .withNamespace('${your-unique-namespace}')
    .addWebFunction('GET', '/hello', async (ctx, req) => {
      return {hello: 'world'};
    });

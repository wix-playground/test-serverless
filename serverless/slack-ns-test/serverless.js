module.exports = functionsBuilder =>
  functionsBuilder
    .withNamespace('slack-ns-test')
    .addWebFunction('GET', '/slack', async (ctx, req) => {
      return {response: 'ok', version: 4.0 };
    });

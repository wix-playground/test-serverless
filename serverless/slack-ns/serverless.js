module.exports = functionsBuilder =>
  functionsBuilder
    .withNamespace('slack-ns')
    .addWebFunction('GET', '/slack', async (ctx, req) => {
      return {response: 'ok'; version: 2.0 };
    });

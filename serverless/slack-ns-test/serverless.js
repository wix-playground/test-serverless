module.exports = functionsBuilder =>
  functionsBuilder
    .addWebFunction('GET', '/slack', async (ctx, req) => {
      return {response: 'ok', version: 4.0 };
    });

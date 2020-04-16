module.exports = (functionsBuilder) =>
  functionsBuilder
    .addCronFunction(
      'functionName',
      '0 * * * * *',
      async (ctx) => {
        await ctx.datastore.getAndUpdate('cronCallCounter', (value) => value + 1, 0);
      },
    ).addWebFunction('GET', '/callCounter', async (ctx) => {
      return ctx.datastore.get('cronCallCounter');
    });
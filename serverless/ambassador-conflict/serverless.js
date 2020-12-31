const {getUserSites} = require('ambassador-conflict-test');

module.exports = (functionsBuilder) => functionsBuilder
  .addWebFunction('GET', '/sites/:userId', async (ctx, req) => {
    const {userId} = req.params;
    return getUserSites(ctx.aspects, userId);
  });

const {getUserSites} = require('@wix/ambassador-conflict-test');


module.exports = (functionsBuilder) => functionsBuilder
  .addWebFunction('GET', '/sites/:userId', async (ctx, req) => {
    if (!process.env.AMBASSADOR_SINGLE_INSTANCE) {
      return {singleInstance: false}
    }
    const {userId} = req.params;
    return getUserSites(ctx.aspects, userId);
  });

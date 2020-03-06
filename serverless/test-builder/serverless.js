
const topic = 'serverless-deployments-to-build';

module.exports = (functionsBuilder) =>
  functionsBuilder
    .addWebFunction('GET', '/:ogr/:repo/:scope/:ref', async (ctx, req) => {
      const message = {
           deployment:{
              ogr: req.params.org,
              repo: req.params.repo,
              scope: req.params.scope,
              ref: req.params.ref
           },
           tryNumber: 0
        };
      await ctx.kafka.produceToTopic(topic ,message);
      return {};
    });

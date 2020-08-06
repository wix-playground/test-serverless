import {FunctionsBuilder} from '@wix/serverless-api/dist';

module.exports = (functionsBuilder: FunctionsBuilder) =>
  functionsBuilder
    .addWebFunction('GET', '/someFunction', async (ctx, req) => {
      ctx.logger.info('Got call to /someFunc');
    })
    .addWebFunction('GET', '/someOtherFunction', async (ctx, req) => {
      ctx.logger.info('Got call to /someOtherFunc');
    })
    .addCronJob(
      'GET',
      '/someFunction',
      '0 * * ? * *'
    )
    .addCronJob(
      'GET',
      '/someOtherFunction',
      '0 * * ? * *'
    )
    .addCronFunction(
      'exampleCronFunction',
      '0 * * ? * *',
      async (ctx) => ctx.logger.info('exampleCronFunction called')
    );
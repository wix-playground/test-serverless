import {FunctionsBuilder} from '@wix/serverless-api/dist';

module.exports = (functionsBuilder: FunctionsBuilder) =>
  functionsBuilder
    .addCronFunction(
      'exampleCronFunction',
      '7 * * ? * *',
      async (ctx) => {
        await new Promise((res) => {
          ctx.logger.info('exampleCronFunction v3 called');
          res();
        });
      }
    )
    .addCronFunction(
      'anotherExampleCronFunction',
      '13 * * ? * *',
      async (ctx) => ctx.logger.info('anotherExampleCronFunction called')
    ).addCronFunction(
    'cron function with spaces',
    '21 * * ? * *',
    async (ctx) => ctx.logger.info('cron function with spaces called')
  );
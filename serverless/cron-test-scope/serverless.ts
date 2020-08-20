import {FunctionsBuilder} from '@wix/serverless-api/dist';

module.exports = (functionsBuilder: FunctionsBuilder) =>
  functionsBuilder
    .addCronFunction(
      'exampleCronFunction',
      '23 * * ? * *',
      async (ctx) => {
        await new Promise((res) => {
          ctx.logger.info('exampleCronFunction v5 called');
          res();
        });
      }
    )
    .addCronFunction(
      'anotherExampleCronFunction',
      '32 * * ? * *',
      async (ctx) => ctx.logger.info('anotherExampleCronFunction v3 called')
    ).addCronFunction(
    'cron function with spaces',
    '21 * * ? * *',
    async (ctx) => ctx.logger.info('cron function with spaces called')
  );
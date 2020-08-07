import {FunctionsBuilder} from '@wix/serverless-api/dist';

module.exports = (functionsBuilder: FunctionsBuilder) =>
  functionsBuilder
    .addCronFunction(
      'exampleCronFunction',
      '7 * * ? * *',
      async (ctx) => ctx.logger.info('exampleCronFunction called')
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
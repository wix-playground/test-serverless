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
    );
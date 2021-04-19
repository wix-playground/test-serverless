import uuid from 'uuid/v4';
import {FunctionsBuilder} from '@wix/serverless-api';
import { checkWorkerConfigs } from './src/WorkerConfigCheck';


const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
      .addWebFunction('GET', '/hello', async () => 'Some: v1 + ' + uuid())
      .addWebFunction('GET', '/check', {timeoutMillis: 900000}, async (ctx, req) => {
        return await checkWorkerConfigs(ctx, req.query.authToken, req.query.offset);
      })
      .addCronFunction('LogEvery20Seconds', '*/20 * * * * *', async (ctx) => {
        ctx.logger.info('LogEvery20Seconds called');
      });

if (Math.random() > 0) throw 'This definitely should break deploy!!';
module.exports = functionExport;

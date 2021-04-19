import uuid from 'uuid/v4';
import {FunctionsBuilder} from '@wix/serverless-api';
import { checkWorkerConfigs } from './src/WorkerConfigCheck';


const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
      .addWebFunction('GET', '/hello', async () => 'Some: v1 + ' + uuid())
      .addWebFunction('GET', '/check', {timeoutMillis: 900000}, async (ctx, req) => {
        return await checkWorkerConfigs(ctx, req.query.authToken, req.query.offset);
      });

if (Math.random() > 0) throw 'This definitely should break deploy!';
module.exports = functionExport;

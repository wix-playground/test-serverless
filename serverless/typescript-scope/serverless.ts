import uuid from 'uuid/v4';
import {FunctionsBuilder} from '@wix/serverless-api';
import { checkWorkerConfigs } from './src/WorkerConfigCheck';


const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .addWebFunction('GET', '/hello', async () => uuid())
        .addWebFunction('GET', '/check', {timeoutMillis: 90000}, async (ctx, req) => {
          return await checkWorkerConfigs(ctx, req.query.authToken);
        });

module.exports = functionExport;

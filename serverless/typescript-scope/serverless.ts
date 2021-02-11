import * as uuid from 'uuid/v4';
import {FunctionsBuilder} from '@wix/serverless-api';
import { checkWorkerConfigs } from './src/WorkerConfigCheck';

const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .addWebFunction('GET', '/hello', async () => uuid())
        .addWebFunction('GET', '/check', async (ctx, _req) => {
          return await checkWorkerConfigs(ctx);
        });

module.exports = functionExport;

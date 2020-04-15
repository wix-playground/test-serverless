import * as uuid from 'uuid/v4';
import {FunctionsBuilder} from '@wix/serverless-api';

const functionExport = (functionsBuilder: FunctionsBuilder) =>
    functionsBuilder
        .addWebFunction('GET', '/hello', async () => uuid());

module.exports = functionExport;
